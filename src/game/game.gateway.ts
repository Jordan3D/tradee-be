import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as uuid from 'uuid';
import { GameService } from './game.service';
import config from '../config';
import Redis, { Redis as RedisType } from 'ioredis';
import { BadRequestException, ForbiddenException, forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { IToken } from '../interfaces/token.interface';
import { IPlayer, IPlayerUser, ISPlayer } from '../interfaces/player.interface';
import { IDPlayers, IXGame, IXPlayers } from '../interfaces/game.interface';
import { actionConsts as AC } from './game.constants';
import { UsersService } from '../users';
import { SystemService } from '../system';
//import { WsThrottlerGuard } from '../common/guards/ws';

interface ByToken {
  token: string,
  gameId: string,
  clientId?: string
}

interface ByClient {
  token?: string,
  gameId?: string,
  clientId: string
}

//@UseGuards(WsThrottlerGuard)
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private pub: RedisType;
  private sub: RedisType;
  
  private clients: object;
  private players: object;
  
  private logger: Logger = new Logger('AppGateway');
  
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UsersService,
    private readonly systemService: SystemService
  ) {
    this.pub = new Redis(config.redis);
    this.sub = new Redis(config.redis);
    this.clients = {};
    this.players = {}; // Мапа с клиентом
    this.sub.subscribe('games');
    
    this.systemService.clearOnlineUsers();
  }
  
  async removePlayerFromList(playerId: string, gameId: string): Promise<void>{
    if(this.players[playerId]){
      delete this.players[playerId];
    } else {
      const message = {
        to: [playerId],
        room: gameId,
        msg: {
          event: 'strict|removePlayerFromList',
          data: {
            playerId
          }
        },
      };
      await this.pub.publish('games', JSON.stringify(message));
    }
  }
  
  findPlayerConnection(playerId: string){
    // If player is on this server his id would be in PLAYERS map
    const player = this.players[playerId];
    
    // next we find his client connection
    return this.clients[player?.cId];
  }
  
  async findPlayerBy({token, gameId, clientId}: ByToken | ByClient): Promise<string | undefined> {
    if(token && gameId){
      const { userId } = jwt.verify(token, config.jwtSecret) as IToken;
  
      const players = await this.gameService.getGamePlayers(gameId, 'default') as IDPlayers;
      const player = Object.values(players).find( (p: IPlayer) => p.userId === userId);
      
      return player ? player.id : undefined
    } else if (clientId) {
      return Object.keys(this.players).find(key => this.players[key]?.cId === clientId);
    }
  }
  
  async addNewPlayer({playerId, gameId, clientId}): Promise<void> {
    const found = await this.findPlayerBy({clientId});
    if(found){
      delete this.players[found];
    }
    this.players[playerId] = {cId: clientId, gameId};
  }
  
  sendClientByPlayer(playerId: string, msg: any){
    const client = this.findPlayerConnection(playerId);
    // if there is client connection -> send a massage
    if(client){
      client.send(JSON.stringify(msg))
    }
  }
  
  afterInit(server: Server) {
    this.logger.log('Init');
  
    this.sub.on('message', async (channel, message) => {
      const { to, msg, room } = JSON.parse(message);
      let game = await this.gameService.getGame(room, 'dynamic');
      
      //console.log('Message');
      //console.log(to, msg, room);
      
      const msgParsed = msg.event.split('|');
      msg.event = msgParsed[1];
      
      if(msgParsed[0] === 'server'){
        // SERVER EVENT
        const host = Object.values(game.players).find((p: ISPlayer) => p.role === 'host');
        const connection = this.gameService.name === game.service;
        
        if(connection){
         // Server is the same as game-server
          
          if(msg.event === 'connectionSynchronize'){
            const {playerId} = msg.data;
            const gameInfo = await this.gameService.getOverallGameInfo(game.id);
            
            const message = {
              to: [playerId],
              room,
              msg: {
                event: 'strict|connectionSynchronize',
                data: gameInfo
              },
            };
  
            this.pub.publish('games', JSON.stringify(message));
          }
          else if (msg.event === 'playerReady'){
            
            if( msg.data.status === 'main'){
              const action = {
                type: AC.PLAYER_CONNECTED,
                [AC.PLAYER_CONNECTED]: msg.data.playerId
              };
  
              await this.gameService.incomingAction(msg.data.gameId, action, 'game');
            }
            
            const players = await this.gameService.getGamePlayers(game.id);
            const everybodyIsReady = Object.values(players).every( (p: IPlayer) => p.status === msg.data.status);
           
            if(everybodyIsReady){
              await this.phaseInitialize(this.findPlayerConnection(host.id), { gameId: game.id, playerId: host.id, phase : msg.data.status });
            }
          }
          else if (msg.event === 'gameResume') {
            const {playerId} = msg.data;
            const gameInfo = await this.gameService.getOverallGameInfoWhileResuming(game.id);
  
            const message = {
              to: [playerId],
              room,
              msg: {
                event: 'strict|gameResume',
                data: gameInfo
              },
            };
  
            this.pub.publish('games', JSON.stringify(message));
          }
          else if (msg.event === 'incomingAction'){
            const {action, playerId} = msg.data;
            await this.gameService.incomingAction(game.id, action, playerId);
          }
        }
        
      }
      else {
        // STRICT EVENT
        // Message retranslation
        // except this ... NEED TO BE REFACTORED BY CREATING NEW SUBSCRIPTION
        if(msg.event === 'removePlayerFromList'){
          const {playerId} = msg.data;
          if(this.players[playerId]){
            delete this.players[playerId];
          }
        } else {
          await Promise.all(to.map( async receiver => {
            if (receiver === 'all') {
              const players = Object.keys(game.players);
      
              if(msg.event === 'deletePlayer'){
                players.push(msg.data.playerIdToDelete);
              }
      
              Promise.all(players.map(async pId => {
                this.sendClientByPlayer(pId, msg);
        
                if(msg.event === 'deletePlayer' && pId === msg.data.playerIdToDelete){
                  delete this.players[pId];
                }
              }));
            } else if (['host'].includes(receiver)) {
              const host = Object.values(game.players).find((p: ISPlayer) => p.role === receiver);
      
              if(host){
                this.sendClientByPlayer(host.id, msg);
              }
            } else {
              this.sendClientByPlayer(receiver, msg);
            }
            return Promise.resolve();
          }));
        }
        //  Event cases
        if(msg.event === 'permissionToConnect' && msg.data.result){
          const message = {
            to: ['all'],
            room,
            msg: {
              event: 'strict|newPlayer',
              data: {
                playerId: msg.data.playerId,
                players: await this.gameService.getGamePlayers(room, 'extended') as IXPlayers,
              }
            },
          };
    
          this.pub.publish('games', JSON.stringify(message));
        }
      }
    });
  }
  
  handleConnection(client: any, ...args: any[]) {
   // client.id = uuid.v4();
  
   // console.log(client.id, 'connected');
    
   // this.clients[client.id] = client;
  }
  
  async handleDisconnect(client: any) {
    console.log(client.id, 'disconnect');
  
    await this.systemService.removeOnlineUser(client.id);
  
    delete this.clients[client.id];
    
    const pId = Object.keys(this.players).find(pId => this.players[pId]?.cId === client.id);
    
    if(!pId){
      return
    }
    
    const game = await this.gameService.getGame(this.players[pId].gameId);
    
    if(game.phase === 'setup'){
      await this.gameService.setGameLobbyOnline(game.id, pId, false);
      const message = {
        to: ['all'],
        room: this.players[pId].gameId,
        msg: {
          event: 'strict|playerDisconnectedLobby',
          data: {
            playerId: pId
          },
        },
      };
      await this.pub.publish('games', JSON.stringify(message));
    }
    
  
    const action = {
      type: AC.PLAYER_DISCONNECTED,
      [AC.PLAYER_DISCONNECTED]: pId
    };
    
    const leaveAction = {
      type: AC.ACTIVATE_LEAVE_TIMER,
      [AC.ACTIVATE_LEAVE_TIMER]: pId
    };
  
    if(pId){
      await this.handleIncomingAction(null,{gameId: this.players[pId].gameId, action});
      await this.handleIncomingAction(null, {gameId: this.players[pId].gameId, action: leaveAction});
      // await this.gameService.checkIfGameCouldBeTerminated(this.players[pId].gameId);
      await this.removePlayerFromList(pId, this.players[pId].gameId);
    }
  }
  
  async sendGameEvent(gameId, gameEvent, to = 'all') {
    const message = {
      to: [to],
      room: gameId,
      msg: {
        event: 'strict|gameEvent',
        data: {
          gameId,
          gameEvent
        },
      },
    };
    this.pub.publish('games', JSON.stringify(message));
  }
  
  @SubscribeMessage('game/connect')
  async handleUserConnection(client: any, data: { token }): Promise<void>{
    console.log('game/connect');
  
    const { token } = data;
    const { userId } = jwt.verify(token, config.jwtSecret) as IToken;
  
    client.id = userId ? userId : uuid.v4();
    this.clients[client.id] = client;
    
    await this.systemService.addOnlineUser(client.id);
    await this.gameService.updateUserGames(userId);
  
    client.send(JSON.stringify({
      event: 'connect',
      data: {
        usersOnline: await this.systemService.getOnlineUsersCount(),
      },
    }));
  }
  
  @SubscribeMessage('game/incomingAction')
  async handleIncomingAction(client: any, data: { gameId, action }): Promise<void>{
    //console.log('game/incomingAction');
    //console.log(data);
  
    const { gameId, action } = data;
    
    const playerId = client ? await this.findPlayerBy({clientId: client.id}) : 'game';
    
  
    const message = {
      to: ['host'],
      room: gameId,
      msg: {
        event: 'server|incomingAction',
        data: {
          action,
          playerId
        },
      },
    };
    this.pub.publish('games', JSON.stringify(message));
  }
  
  /** Game connection synchronize
   *  Универсальный обработчик. Синхронизирует данные на каждой из фаз
   *  {
   *    phases: "new/setup/sync"
   *  }
   * */
  @SubscribeMessage('game/connectionSynchronize')
  async connectionSynchronize(client: any, data: { gameId, token }): Promise<void> {
    //console.log('game/connectionSynchronize');
    //console.log(data);
    
    const { gameId, token } = data;
    const { userId } = jwt.verify(token, config.jwtSecret) as IToken;
    
    let game = await this.gameService.getGame(gameId);
    
    if (!game) {
      throw new BadRequestException();
    }
    
    const phase = game.phase;
    const xGame = { ...game, players: {} as any } as IXGame;
    xGame.players = await this.gameService.getGamePlayers(gameId, 'extended') as IXPlayers;
    
    const currentPlayer = Object.values(xGame.players).find( (p: IPlayerUser) => p.userId === userId);
    
    if (!currentPlayer) {
      throw new BadRequestException();
    }
    
    // Restrictions
    const playerIsPresent = Object.values(game.players).some((player: ISPlayer) => player.id === currentPlayer.id);
    // ---
    
    if (playerIsPresent) {
      if(phase === 'new'){
        //const cId = this.players[playerId];
        await this.addNewPlayer({clientId: client.id, gameId, playerId: currentPlayer.id});
        const playerIsHost = Object.values(game.players).find((p: ISPlayer) => p.role === 'host').id === currentPlayer.id;
        if(playerIsHost){
          const _game = await this.gameService.setGamePhase({game, gameId, phase: 'setup'});
          xGame.phase = _game.phase;
        }
  
        const playersOnline = await this.gameService.setGameLobbyOnline(gameId, currentPlayer.id, true);
  
        client.send(JSON.stringify({
          event: 'connectionSynchronize',
          data: {
            game: xGame,
            playersOnline
          },
        }));
  
        const value = {
          playerId: currentPlayer.id,
          gameId: gameId
        };
  
        await this.gameService.setCurrentData(currentPlayer.user.id, value);
      }
      else if (phase === 'setup') {
        
        const player = this.players[currentPlayer.id];
        if(!player){
          await this.addNewPlayer({clientId: client.id, gameId, playerId: currentPlayer.id});
        } else {
          // Sync with other game
          //console.log('SYNC WITH OTHER GAME');
        }
        
        const playersOnline = await this.gameService.setGameLobbyOnline(gameId, currentPlayer.id, true);
  
        client.send(JSON.stringify({
          event: 'connectionSynchronize',
          data: {
            game: xGame,
            playersOnline
          },
        }));
  
        const message = {
          to: ['all'],
          room: gameId,
          msg: {
            event: 'strict|playerConnectedLobby',
            data: {
              playerId: currentPlayer.id
            },
          },
        };
        await this.pub.publish('games', JSON.stringify(message));
  
        const value = {
          playerId: currentPlayer.id,
          gameId: gameId
        };
        
        await this.gameService.setCurrentData(currentPlayer.user.id, value);
      }
      else if (phase === 'init') {
        // Getting current information about all assets, players
        const message = {
          to: ['game'],
          room: gameId,
          msg: {
            event: 'server|connectionSynchronize',
            data: {
              playerId: currentPlayer.id
            },
          },
        };
       await this.pub.publish('games', JSON.stringify(message));
      }
      else if (phase === 'start') {
        const player = this.players[currentPlayer.id];
        if(!player){
          await this.addNewPlayer({clientId: client.id, gameId, playerId: currentPlayer.id});
        } else {
          // Sync with other game
          //console.log('SYNC WITH OTHER GAME');
        }
        // Getting current information about all assets, players
        const message = {
          to: ['game'],
          room: gameId,
          msg: {
            event: 'server|connectionSynchronize',
            data: {
              playerId: currentPlayer.id
            },
          },
        };
        await this.pub.publish('games', JSON.stringify(message));
        
        const value = {
          playerId: currentPlayer.id,
          gameId: gameId
        };
        
        await this.gameService.setCurrentData(currentPlayer.user.id, value);
      }
      else if (phase === 'main') {
        // Getting current information about all assets, players
        const player = this.players[currentPlayer.id];
        if(!player){
          await this.addNewPlayer({clientId: client.id, gameId, playerId: currentPlayer.id});
        } else {
          // Sync with other game
          //console.log('SYNC WITH OTHER GAME');
        }
        
        const message = {
          to: ['game'],
          room: gameId,
          msg: {
            event: 'server|connectionSynchronize',
            data: {
              playerId: currentPlayer.id
            },
          },
        };
        await this.pub.publish('games', JSON.stringify(message));
        
        const action = {
          type: AC.PLAYER_CONNECTED,
          [AC.PLAYER_CONNECTED]: currentPlayer.id
        };
  
        const leaveAction = {
          type: AC.DEACTIVATE_LEAVE_TIMER,
          [AC.DEACTIVATE_LEAVE_TIMER]: currentPlayer.id
        };

        await this.handleIncomingAction(null, {gameId, action});
        await this.handleIncomingAction(null, {gameId, action: leaveAction});
      }
    } else {
      client.send(JSON.stringify({
        event: 'connectionSynchronize',
        data: {},
        errors: ['Not authorized'],
      }));
    }
  }
  
  
  /** Game phase initialize
   *  Универсальный обработчик. Инициализирует фазу игры
   *  {
   *    phases: "new/setup/sync"
   *  }
   * */
  @SubscribeMessage('game/phase/initialize')
  async phaseInitialize(client: any, data: any): Promise<void> {
    
    /**На "new", создает игру и помещает ее в память
     * Так же игра доступна для подключения другим
     * */
    
    /**На "setup",берет общие доступные данные по игре и отправляет их
     * Используется при переподключении и добавлении нового игрока
     * */

    console.log('game/phase/initialize');
    //console.log(data);
  
    const { gameId, phase } = data;
    const game = await this.gameService.getByIdFromRedis(gameId);
    const playerId = await this.findPlayerBy({clientId: client.id});
    // только хост может осуществить переход по фазам
    const playerIsHost = Object.values(game.players).find((p: ISPlayer) => p.role === 'host').id === playerId;
    
    
    if(playerIsHost){
      if (game.phase === 'setup'){
        if(phase === 'init'){
          // if all players are ready
          const players = await this.gameService.getGamePlayers(gameId);
          let count = 5;
          const timer = () => {
            setTimeout(async()=>{
              const players = await this.gameService.getGamePlayers(gameId);
        
              if(count === 0){
                const message1 = {
                  to: ['all'],
                  room: gameId,
                  msg: {
                    event: 'strict|setCountdown',
                    data: {
                      gameId,
                      status: 'finish'
                    },
                  },
                };
                this.pub.publish('games', JSON.stringify(message1));
          
                // initialize phase
                await this.gameService.setGamePhase({game, gameId, phase});
                await this.gameService.newGameInitEntities(gameId);
                
                const message2 = {
                  to: ['all'],
                  room: gameId,
                  msg: {
                    event: 'strict|phase/initialize',
                    data: {
                      gameId,
                      phase: 'init'
                    },
                  },
                };
                await this.pub.publish('games', JSON.stringify(message2));
          
              } else if(Object.values(players).every(p => p.status === 'init')){
                count--;
          
                const message = {
                  to: ['all'],
                  room: gameId,
                  msg: {
                    event: 'strict|setup/setCountdown',
                    data: {
                      gameId,
                      status: count
                    },
                  },
                };
                await this.pub.publish('games', JSON.stringify(message));
                timer();
              } else {
                const message = {
                  to: ['all'],
                  room: gameId,
                  msg: {
                    event: 'strict|setup/setCountdown',
                    data: {
                      gameId,
                      status: 'stop'
                    },
                  },
                };
                await this.pub.publish('games', JSON.stringify(message));
              }
            }, 1000);
          };
    
          if(Object.values(players).every(p => p.status === 'init')){
            timer();
            const message = {
              to: ['all'],
              room: gameId,
              msg: {
                event: 'strict|setup/setCountdown',
                data: {
                  gameId,
                  status: 'start'
                },
              },
            };
            await this.pub.publish('games', JSON.stringify(message));
          } else {
            const message = {
              to: ['host'],
              room: gameId,
              msg: {
                event: 'strict|phase/initialize',
                data: {
                  error: "Not everyone are ready"
                },
              },
            };
            await this.pub.publish('games', JSON.stringify(message));
          }
        } else if(status === 'setup') {
    
        } else {
          throw new BadRequestException();
        }
        
      }
      else if (game.phase === 'init'){
        if(phase === 'start'){
          const players = await this.gameService.getGamePlayers(gameId);
    
          const playersAreReady = Object.values(players).every(p => p.status === 'start');
    
          if(playersAreReady){
            await this.gameService.setGamePhase({game, gameId, phase});
  
            const message = {
              to: ['all'],
              room: gameId,
              msg: {
                event: 'strict|phase/initialize',
                data: {
                  gameId,
                  phase: 'start'
                },
              },
            };
            await this.pub.publish('games', JSON.stringify(message));
          }
        }
      }
      else if (game.phase === 'start'){
        if(phase === 'main'){
          const players = await this.gameService.getGamePlayers(gameId);
    
          const playersAreReady = Object.values(players).every(p => p.status === 'main');
    
          if(playersAreReady){
            await this.gameService.setGamePhase({game, gameId, phase});
      
            const message = {
              to: ['all'],
              room: gameId,
              msg: {
                event: 'strict|phase/initialize',
                data: {
                  gameId,
                  phase: 'main'
                },
              },
            };
            await this.pub.publish('games', JSON.stringify(message));
  
            this.gameService.startGame(gameId);
          }
        }
      }
      else if (game.phase === 'main'){
     
      }
    } else {
      throw new ForbiddenException();
    }
  }
  
  
  /** Get settings config
   *  Отдает конфигурации найстроек (тип, макс. мин. значение)
   * */
  @SubscribeMessage('game/settingsConfig:get')
  getSettingsConfig(client: any, data: any): void {
    //console.log(data);
  }
  
  
  /** Permission to connect to game
   *  {
   *    type: "ask"
   *    gameId
   *  }
   *  {
   *    type: "response"
   *    result
   *  }
   * */
  @SubscribeMessage('game/setup/permissionToConnect')
  async permissionToConnectOnSetup(client: any, data: any): Promise<void> {
    console.log('game/setup/permissionToConnect');
    //console.log(data);
    
    const { gameId, token, result } = data;
    
    if (result) {
      const { answer, to } = result;
      
      if (answer) {
        const player: IPlayer = await this.gameService.addPlayer({gameId, userId: to});
        
        if (player) {
          const message = {
            to: ['host', to],
            room: gameId,
            msg: {
              event: 'strict|permissionToConnect',
              data: {
                gameId,
                playerId: player.id,
                result: true,
              },
            },
          };
          
          await this.pub.publish('games', JSON.stringify(message));
        } else {
          const message = {
            to: ['host', to],
            room: gameId,
            msg: {
              event: 'strict|permissionToConnect',
              data: {
                gameId,
                result: false,
              },
              error: ['something goes wrong'],
            },
          };
          
          await this.pub.publish('games', JSON.stringify(message));
        }
        
      }
      else {
        const message = {
          to: [to],
          room: gameId,
          msg: {
            event: 'strict|permissionToConnect',
            data: {
              gameId,
              result: false,
            },
          },
        };

        await this.pub.publish('games', JSON.stringify(message));
      }
    } else {
      const { userId } = jwt.verify(token, config.jwtSecret) as IToken;
      const userData = await this.userService.getById(userId);
      
      const message = {
        to: ['host'],
        room: gameId,
        msg: {
          event: 'strict|permissionToConnect',
          data: {
            gameId,
            user: {id: userId, name: userData.name, avatar: userData.avatar},
          },
        }
      };
      
    
      this.sub.on('message', (channel, message) => {
        const { to, msg, room } = JSON.parse(message);
  
        if(room !== gameId){
          return undefined;
        }
  
        const msgParsed = msg.event.split('|');
        msg.event = msgParsed[1];
        
        to.map(receiver => {
          if (receiver === userId) {
            client.send(JSON.stringify(msg));
          }
        });
      });
      
      await this.pub.publish('games', JSON.stringify(message));
    }
  }
  
  
  /** Set game settings
   *  Редактирование настроек игры
   * */
  @SubscribeMessage('game/settingsSet')
  async settingsSet(client: any, data: { gameId, playerId, settings }): Promise<void> {
    console.log('game/settingsSet');
    //console.log(data);
    
    const { gameId, playerId, settings } = data;
    
    const game = await this.gameService.getByIdFromRedis(gameId);
    
    // Restrictions
    const playerIsHost = Object.values(game.players).find((p: ISPlayer) => p.role === 'host').id === playerId;
    // ---
    
    if (playerIsHost) {
      await this.gameService.setGameSettings(gameId, settings);
      
      const message = {
        to: ['all'],
        room: gameId,
        msg: {
          event: 'strict|settings',
          data
        }
      };
      await this.pub.publish('games', JSON.stringify(message));
    } else {
      throw new BadRequestException();
    }
  }
  
  
  /** Delete player from game
   *
   * */
  @SubscribeMessage('game/deletePlayer')
  async deletePlayer(client: any, data: { gameId, playerIdToDelete }): Promise<void> {
    console.log('game/deletePlayer');
    //console.log(data);
    
    const { gameId, playerIdToDelete } = data;
  
    const playerId = await this.findPlayerBy({clientId: client.id});
  
    const game = await this.gameService.getByIdFromRedis(gameId);
  
    // Restrictions
    const playerIsHost = Object.values(game.players).find((p: ISPlayer) => p.role === 'host').id === playerId;
    // ---
    
    if (playerIsHost) {
      await this.gameService.deletePlayer({gameId, playerId: playerIdToDelete});
      
      const message = {
        to: ['all'],
        room: gameId,
        msg: {
          event: 'strict|deletePlayer',
          data,
        },
      };
      this.pub.publish('games', JSON.stringify(message));
      // wait 5 sec
      await new Promise(r => setTimeout(r, 3000));
      await this.removePlayerFromList(playerIdToDelete, gameId);
    } else {
      throw new BadRequestException();
    }
  }
  
  
  /** Get game settings
   *  Отправка настроек по игре
   * */
  @SubscribeMessage('game/settings')
  settings(client: any, data: any): void {
    //console.log(data);
  }
  
  /** Get game settings
   *  Отправка настроек по игре
   * */
  @SubscribeMessage('game/resume')
  async resume(client: any, data: { gameId, token }): Promise<void> {
    const { gameId, token } = data;
    const { userId } = jwt.verify(token, config.jwtSecret) as IToken;
  
    let game = await this.gameService.getGame(gameId, 'dynamic');
    
    const xGame = { ...game, players: {} as any } as IXGame;
    xGame.players = await this.gameService.getGamePlayers(gameId, 'extended') as IXPlayers;
  
    const currentPlayer = Object.values(xGame.players).find( (p: IPlayerUser) => p.userId === userId);
    
    if(currentPlayer){
      const player = this.players[currentPlayer.id];
      if(!player){
        await this.addNewPlayer({clientId: client.id, gameId, playerId: currentPlayer.id});
      } else {
        // Sync with other game
        //console.log('SYNC WITH OTHER GAME');
      }
      
      const message = {
        to: ['game'],
        room: gameId,
        msg: {
          event: 'server|gameResume',
          data: {
            playerId: currentPlayer.id
          },
        },
      };
      await this.pub.publish('games', JSON.stringify(message));
    }
  }
  
  
  /** Set player ready for next phase (on setup phase)
   *
   * */
  @SubscribeMessage('game/setup/playerReady')
  async playerReadyOnSetup(client: any, data: { gameId, playerId, ready }): Promise<void> {
    console.log('game/setup/playerReady');
    //console.log(data);
  
    const { gameId, playerId, ready } = data;
    const status = ready ? 'init' : 'setup';
    
    await this.gameService.setPlayerStatus({gameId, playerId, status});
  
    const message = {
      to: ['all'],
      room: gameId,
      msg: {
        event: 'strict|playerReady',
        data: {
          ...data,
          status
        },
      },
    };
    this.pub.publish('games', JSON.stringify(message));
  }
  
  
  /** Set player ready for next phase (on init phase)
   *
   * */
  @SubscribeMessage('game/init/playerReady')
  async playerReadyOnStart(client: any, data: { gameId, playerId, ready }): Promise<void> {
    console.log('game/init/playerReady');
    //console.log(data);
    
    const { gameId, playerId, ready } = data;
    const status = ready ? 'start' : 'init';
    
    await this.gameService.setPlayerStatus({gameId, playerId, status});
    
    const message = {
      to: ['host'],
      room: gameId,
      msg: {
        event: 'server|playerReady',
        data: {
          ...data,
          status
        },
      },
    };
    this.pub.publish('games', JSON.stringify(message));
  }
  
  
  /** Set player ready for next phase (on start phase)
   *
   * */
  @SubscribeMessage('game/start/playerReady')
  async playerReadyOnMain(client: any, data: { gameId, playerId, ready }): Promise<void> {
    console.log('game/start/playerReady');
    //console.log(data);
    
    const { gameId, playerId, ready } = data;
    const status = ready ? 'main' : 'start';
    
    await this.gameService.setPlayerStatus({gameId, playerId, status});
    
    const message = {
      to: ['host'],
      room: gameId,
      msg: {
        event: 'server|playerReady',
        data: {
          ...data,
          status
        },
      },
    };
    this.pub.publish('games', JSON.stringify(message));
  }
  
  
  /***Events to send
   *
   * permissionToConnect
   * {type: "ask", user: IUser}
   *
   * permissionToConnect
   * {type: "response", result}
   *
   * settings : GameSettings
   *
   *
   * Отправка любого евента что произошел во время сетапа игры:
   * -коннект/дисконнект игрока
   * -изменение настроек
   * -изменение статуса готовности
   *
   * setupEvent : SetupEvent
   * */
  
}