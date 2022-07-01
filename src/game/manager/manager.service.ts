import {
  Injectable, Logger, Inject, forwardRef,
} from '@nestjs/common';
import * as uuid from 'uuid';

import { InjectRedis } from '../../util/redis/index';
import { IAsset, IXAsset } from '../../interfaces/asset.interface';
import { ItemService } from '../../item/item.service';
import { GameService } from '../game.service';
import { IManager } from '../../interfaces/manager.interface';
import { IGameMap, IXGameMap } from '../../interfaces/gameMap.interface';
import { ITransaction } from '../../interfaces/transaction.interface';
import { GameMapService } from '../../gameMap/gameMap.service';
import { IDPlayers, IGame, IXPlayers } from '../../interfaces/game.interface';
import { actionConsts as AC, customCards, customCardsOwn, gameConsts, gameConsts as GC } from '../game.constants';
import { arrayShuffle, rollDice } from '../../util';
import Timeout = NodeJS.Timeout;
import { IItem } from '../../interfaces/item.interface';
import { ItemGroupService } from '../../itemGroup/itemGroup.service';
import { ActionService } from '../action/action.service';
import { dummyDataAdd, dummyGameData } from '../../util/testData';

//const dummyOwner = '8baf4adb-3613-4a89-8ca1-c3d99b3eff26';

interface IOptions {
cFlag?: boolean, sameTurn?: boolean
}

function makeCLAsset(assets, item, owner = 'game') {
  const asset = {
    id: uuid.v4(),
    owner,
    item: item.id,
    isMortgaged: false,
  } as IAsset;
  
  const xAsset = {
    ...asset,
    item: item,
  } as IXAsset;
  assets[xAsset.id] = xAsset;
  
  return xAsset;
}

/** asset service */
@Injectable()
export class ManagerService {
  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    private readonly actionService: ActionService,
    private readonly itemService: ItemService,
    private readonly itemGroupService: ItemGroupService,
    private readonly gameMapService: GameMapService,
  ) {

  }

  async create(gameId: string): Promise<IManager | undefined> {
    const game = await this.gameService.getGame(gameId);
    if (!game) {
      return undefined;
    }
    
    const {
      multiCL,
      multiProperty,
      multiRent,
      multiTax,
      multiUpcost,
      multiMortgage,
      playersCount,
      isCustomCards,
      isCustomCardsPlayersOwn,
    } = game.settings;
    

    const m = new Manager();
    const map = await this.gameMapService.getByName('First try map');
    const assets = {};

    m.itemGroupsAssets = {};
    const itemGroups = {};
    await (await this.itemGroupService.getAll()).forEach(item => {
      itemGroups[item.id] = item.name;
      m.itemGroupsAssets[item.id] = [];
    });
    
    const gamePlayers = await this.gameService.getGamePlayers(gameId, 'extended') as IXPlayers;
    // const pIdd = Object.keys(gP).find(pId => {
    //   console.log(gP[pId].user.id, dummyOwner);
    //   return gP[pId].user.id === dummyOwner;
    // });
    
    const steps = await Promise.all(map.steps.map(async itemName => {
      const item: IItem = await this.itemService.getByName(itemName);
      
      // MULTIPLY PROPERTY COST
      item.cost = Math.round(item.cost * multiProperty);
      
      // MULTIPLY PROPERTY UPCOST
      item.additional.upcost = Math.round(Number(item.additional.upcost) * multiUpcost) as any;
  
      // MULTIPLY PROPERTY MORTGAGE
      item.additional.mortgage = Math.round(Number(item.additional.mortgage) * multiMortgage) as any;
      
      // MULTIPLY RENT
      if(item?.additional?.rent){
        for(let [key, value] of Object.entries(item?.additional?.rent)){
          item.additional.rent[key] =  Math.round(Number(value) * multiRent);
        }
        // MULTIPLY TAX
      } else if (item?.additional?.pay){
        // @ts-ignore
        item.additional.pay =  Math.round(Number(item?.additional?.pay) * multiTax);
      }
      
      const asset = {
        id: uuid.v4(),
        owner: 'game',
        item: item.id,
        isMortgaged: false,
        color: item.additional.group ? (await this.itemGroupService.getById(item.additional.group)).color : '',
        lvl: 0,
      } as IAsset;

      if (item.additional.group) {
        m.itemGroupsAssets[item.additional.group].push(asset.id);
        item.additional.groupName = itemGroups[item.additional.group];
      }
      
      // dummyData add
      //dummyDataAdd(asset, gamePlayers);

      const xAsset = {
        ...asset,
        item: item,
      } as IXAsset;
      assets[xAsset.id] = xAsset;

      return xAsset.id;
    }));
  
    const lotteries = [];
    
    await Promise.all(map.lotteries.map(async itemName => {
      const item = await this.itemService.getByName(itemName);
      
      if(!isCustomCards && customCards.includes(item.name)) {
        return undefined;
      }
  
      // MULTIPLY LOTTERY VALUES
      if(item?.additional?.value){
        // @ts-ignore
        item.additional.value = Math.round(Number(item.additional.value) * multiCL)
      }
  
      // MULTIPLY CHANCE VALUES
      if(item?.additional?.value){
        // @ts-ignore
        item.additional.value = Math.round(Number(item.additional.value) * multiCL)
      }
  
      // create card for each user and gave it to him
      if(isCustomCardsPlayersOwn && customCardsOwn.includes(itemName)){
        Object.keys(gamePlayers).map(pId => {
          const xAsset = makeCLAsset(assets, item, pId);
          lotteries.push(xAsset.id);
        });
      } else {
        const xAsset = makeCLAsset(assets, item);
        lotteries.push(xAsset.id);
      }
    }));

    const chances = [];
    
    await Promise.all(map.chances.map(async itemName => {
      const item = await this.itemService.getByName(itemName);
  
      if(!isCustomCards && customCards.includes(item.name)){
        return undefined;
      }
  
      // MULTIPLY CHANCE VALUES
      if(item?.additional?.value){
        // @ts-ignore
        item.additional.value = Math.round(Number(item.additional.value) * multiCL)
      }
      
      // create card for each user and gave it to him
      if(isCustomCardsPlayersOwn && customCardsOwn.includes(itemName)){
        Object.keys(gamePlayers).map(pId => {
          const xAsset = makeCLAsset(assets, item, pId);
          chances.push(xAsset.id);
        });
      } else {
        const xAsset = makeCLAsset(assets, item);
        chances.push(xAsset.id);
      }
      
    }));

    const playersSequence: string[] = Object.keys(game.players);

    // Shuffle lotteries, chances & players
    arrayShuffle(lotteries);
    arrayShuffle(chances);
    arrayShuffle(playersSequence);

    // Finishing map creation and copy assets on steps for possible future
    m.map = {
      id: map.id,
      name: map.name,
      steps,
      lotteries,
      chances,
    };

    // By game init player information
    m.game = game;
    m.assets = assets;

    m.playersSequence = playersSequence;
    Object.values(m.game.players).forEach(p => {
      m.playersPosition[p.id] = 0;
      m.playersMoney[p.id] = m.game.settings.startMoney;
      m.playersOnline[p.id] = null;
      m.playersPauses[p.id] = gameConsts.pauseLimit;
      m.playersLeavePauses[p.id] = {t: null, value: gameConsts.maxLeaveTimer, date: 0}
    });
    
    // Manager Dummy data
   // m.houseCount = dummyGameData.houseCount;
    //m.hotelCount = dummyGameData.hotelCount;

    return m;
  }

  async dismiss(m: IManager): Promise<void> {
    if (m?.timer?.t) {
      clearTimeout(m.timer.t);
    }

    // Get all players to remove sessions
    const gamePlayers = await this.gameService.getGamePlayers(m.game.id);

    for (const [id, p] of Object.entries(gamePlayers)) {
      await this.gameService.removeCurrentData(p.userId);
      await this.gameService.removePlayerConnection(id, m.game.id);
    }

    // Remove all data from REDIS
    await this.gameService.removeGame(m.game.id);

    // Remove all data from MEMORY
    for (let key in m) {
      m[key] = undefined;
    }
  }

  async bankrupt(m: IManager, playerId: string): Promise<void> {
    // собирается список всех ассетов и присуждается банку
    for (let [assetId, asset] of Object.entries<IXAsset>(m.assets)) {
      if (asset.owner === playerId) {
        asset.lvl = 0;
        asset.owner = 'game';
      }
    }
    // статус игрока становится "наблюдатель"
    await this.gameService.setPlayerStatus({ playerId, status: 'watcher', gameId: m.game.id });
    // удаляем его из последовотельности
    const playerIndex = m.playersSequence.indexOf(playerId);
    if(playerIndex >= 0){
      m.playersSequence.splice(playerIndex, 1);
    }
  
    // отсылка всем что игрок - банкрот
    const gameEvent = {
      type: AC.BANKRUPT,
      [AC.BANKRUPT]: playerId,
    };

    await this.gameService.sendGameEvent(m.game.id, gameEvent);
  }

  async endGame(m: IManager): Promise<boolean> {
    if (m.win) {
      // всем игрокам высылается сообщение о победе игрока
      const gameEvent = {
        type: AC.WIN,
        [AC.WIN]: {
          playerId: m.win
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);

      // включается таймер 30 секунд после истечения которого на фронте идет переход на финальный экран
      m.timer.date = Date.now();
      m.timer.value = 33;
      m.timer.verification = m.playersSequence;
      const timerStart = {
        type: AC.TIMER,
        [AC.TIMER]: {
          value: m.timer.value - 3,
          date: m.timer.date,
          verification: m.timer.verification
        },
      };

      await this.gameService.sendGameEvent(m.game.id, timerStart);

      this.time(m, m.timer.date, async () => {
        m.timer = { value: 3, date: m.timer.date, t: null, verification: [], entity: null };
        const timerStart = {
          type: AC.TIMER,
          [AC.TIMER]: {
            value: m.timer.value - 3,
            date: m.timer.date,
            verification: m.timer.verification
          },
        };
        await this.gameService.sendGameEvent(m.game.id, timerStart);

        //запуск процедуры уничтожения игры
        await this.gameService.eraseGameInfo(m.game.id);
      });
      m.timer.entity.tick();

      return true;
    } else {
      return false;
    }
  }

  async endGameCheck(m: IManager): Promise<boolean> {
    // let counter = [];
    // const players = await this.gameService.getGamePlayers(m.game.id, 'default') as IDPlayers;
    //
    // m.playersSequence.forEach(pId => {
    //   if(players[pId].status === 'main'){
    //     counter.push(players[pId]);
    //   }
    // });
    //
    // console.log(counter);
    //
    // if(counter.length === 1){
    //   m.win = counter[0];
    //
    //   return true;
    // } else {
    //   return false;
    // }
    if (m.playersSequence.length === 1) {
      m.win = m.playersSequence[0];
      return true;
    }

    return false;
  }
  
  async playerRemove(m: IManager, playerId: string): Promise<void> {
    await this.bankrupt(m, playerId);
    await this.gameService.removePlayerConnection(playerId, m.game.id);
  }

  async calcHouseCount(m: IManager): Promise<number> {
    const old = m.houseCount;
    m.houseCount += Math.floor(Math.random() * m.playersSequence.length + 1);

    if (Math.floor(old) !== Math.floor(m.houseCount)) {
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.HOUSE_COUNT,
          [AC.HOUSE_COUNT]: m.houseCount,
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
    }

    return m.houseCount;
  }
  
  async calcHotelsCount(m: IManager): Promise<number> {
    const old = m.hotelCount;
    m.hotelCount += Math.floor(Math.random() * m.playersSequence.length + 1);
    
    if (Math.floor(old) !== Math.floor(m.hotelCount)) {
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.HOTEL_COUNT,
          [AC.HOTEL_COUNT]: m.hotelCount,
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
    }
    
    return m.hotelCount;
  }

  async makeMove(m: IManager, playerId: string, move: number):
    Promise<{ oldPos: number, newPos: number, move: number }> {
    const newPos = m.playersPosition[playerId] + move;
    const oldPos = m.playersPosition[playerId];
  
    m.playersPosition[playerId] = newPos < m.map.steps.length ? newPos < 0 ? m.map.steps.length + newPos : newPos : newPos - m.map.steps.length;
    return {
      oldPos,
      newPos: m.playersPosition[playerId],
      move,
    };
  }

  async goToStep(m: IManager, step: string, playerId: string): Promise<{ oldPos: number, newPos: number, move: number } | undefined> {
    const map = await this.gameMapService.getByName('First try map');
    const stepPosition = map.steps.findIndex(item => item === step);

    if (stepPosition === -1) {
      return;
    }

    const current = m.playersPosition[playerId]; // move from current position
    let move = 0;

    if (current < stepPosition) {
      move = stepPosition - current;
    } else {
      move = (m.map.steps.length - current) + stepPosition;
    }

    const made = await this.makeMove(m, playerId, move);

    const changedPosition = {
      type: AC.POSITION,
      [AC.POSITION]: {
        playerId,
        data: made,
      },
    };
    await this.gameService.sendGameEvent(m.game.id, changedPosition);
    
    // UNDO START
    this.undoAction(m, async(m:IManager) => {
      const made = await this.makeMove(m, playerId, -move);
      const changedPosition = {
        type: AC.POSITION,
        [AC.POSITION]: {
          playerId,
          data: made,
        },
      };
      await this.gameService.sendGameEvent(m.game.id, changedPosition);
    });
    // UNDO END
    
    return made;
  }

  async makeTransaction(m: IManager, t: ITransaction): Promise<boolean> {
    const { from, to, asset: assetId } = t;
    const { players } = m.game;
    const fromPlayer = players[from];
    const toPlayer = players[to];
    const asset = m.assets[assetId];

    // Если игрок и ассет существуют и ассет пренадлежит игроку
    if (fromPlayer && asset && asset.owner === fromPlayer.id) {
      asset.owner = to;

      return true;
    } else {
      return false;
    }
  }

  async setSubPhase(m: IManager, subPhase: string): Promise<void> {

    if (subPhase === AC.PLAYERS_TURN) {
      if (m.turn) {
        const currentIndex = m.playersSequence.findIndex(pId => pId === m.turn);

        // next exist
        if (m.playersSequence[currentIndex + 1]) {
          m.turn = m.playersSequence[currentIndex + 1];
        } else {
          m.turn = m.playersSequence[0];
        }
      } else {
        m.turn = m.playersSequence[0];
      }
    } else if (subPhase === AC.PARTY) {

    } else if (subPhase === AC.AFTER_PARTY) {

    } else {
      return Promise.reject('setSubPhase error');
    }
    m.subPhase = subPhase;
  }

  async startGame(m: IManager): Promise<boolean> {
    // wait 2 sec
    await new Promise(r => setTimeout(r, 2000));
    m.game = await this.gameService.getGame(m.game.id);

    await this.gameCycle(m);

    return true;
  }

  async rollDiceOperation(m: IManager, disableDouble: boolean = false): Promise<number[]> {
    let dices = rollDice(2);
    //let dices = m.counter < m.dicesD.length ? m.dicesD[m.counter] : rollDice(2); //for JAIL
    // const dices: number[] = [1, 1];
    m.prevDices = dices;
    m.counter++;
    /** MOCKED DATA*/
    const rollDiceEvent = {
      type: AC.DICES,
      dices,
    };
    await this.gameService.sendGameEvent(m.game.id, rollDiceEvent);

    if(!disableDouble){
      m.turnDoubles = dices[0] === dices[1] ? m.turnDoubles + 1 : 0;
  
      // UNDO START
      this.undoAction(m, async(m: IManager) => {
       if(dices[0] === dices[1]){
         m.turnDoubles--;
       }
      });
      // UNDO END
    }

    // wait 2 sec
    await new Promise(r => setTimeout(r, 2000));

    return dices
  }

  async goToJail(m: IManager, playerId: string): Promise<void> {
    // UNDO START
    const turnDoubles = m.turnDoubles;
    this.undoAction(m, async(m: IManager) => {
      m.turnDoubles = turnDoubles;
    });
    // UNDO END
    const prisoner = playerId !== undefined ? playerId : m.turn;
    m.turnDoubles = 0;
    // change player position to jail
    await this.goToStep(m, 'jail', prisoner);

    m.playersInJail[prisoner] = 3;
    // send jail event
  
    // UNDO START
    this.undoAction(m, async(m: IManager) => {
      delete m.playersInJail[prisoner];
    });
    // UNDO END

    const gameEvent = {
      type: AC.REACTION,
      [AC.REACTION]: {
        type: AC.JAIL,
        [AC.JAIL]: prisoner
      },
    };
    await this.gameService.sendGameEvent(m.game.id, gameEvent);
  
    // UNDO START
    this.undoAction(m, async(m: IManager) => {
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.JAIL_REDEMPTION,
          [AC.JAIL_REDEMPTION]: prisoner
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
    });
    // UNDO END
  }

  time(m: IManager, date, onEnd) {
    m.timer.entity = {
      tick: () => {
        if (m.timer.value > 0 && m.timer.date === date && !m.timer.pause) {
          m.timer.t = setTimeout(() => {
            m.timer.value -= 1;
            m.timer.entity.tick();
          }, 1000);
        } else {
          if (m.timer.date === date && !m.timer.pause) {
            onEnd();
          }
        }
      }
    }
  }

  async processAction(m: IManager, action: any, from: string): Promise<void> {
    this.actionService.processAction(m, action, from);
  }
  
  async stepAction({m, asset}: {m: IManager, asset: IXAsset}): Promise<void> {
    if (asset.owner !== 'game' && m.turn !== asset.owner && !asset.isMortgaged) {
      let rent;
      let lvl = 0;
      let mul = 1;
      if (asset.item.additional.group) {
        const monopoly = m.itemGroupsAssets[asset.item.additional.group];
        const group = await this.itemGroupService.getById(asset.item.additional.group);
      
        if (group.name === 'transport') {
          monopoly.forEach(aId => {
            if (m.assets[aId].owner === asset.owner && aId !== asset.id)
              lvl++;
          });
          mul = 1;
        } else if (group.name === 'communal') {
          monopoly.forEach(aId => {
            if (m.assets[aId].owner === asset.owner && aId !== asset.id)
              lvl++;
          });
          mul = (await this.rollDiceOperation(m, true)).reduce((acc, current) => acc + current, 0);
        }
        else if (monopoly && monopoly.every(aId => m.assets[aId].owner === asset.owner)) {
          if (!asset.lvl) {
            lvl = asset.lvl;
            mul = 2;
          } else {
            lvl = asset.lvl;
            mul = 1;
          }
        }
      }
      else {
        lvl = asset.lvl;
        mul = 1;
      }
    
      await new Promise(r => setTimeout(r, 1000));
    
      rent = Number(asset.item.additional.rent[lvl]) * mul;
      m.playersMoney[m.turn] -= rent;
      m.playersMoney[asset.owner] += rent;
    
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.TRANSACTIONS,
          [AC.TRANSACTIONS]: [
            {
              from: m.turn,
              to: asset.owner,
              type: AC.MONEY,
              money: rent,
            },
          ],
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
      
      // UNDO START
      this.undoAction(m, async(m: IManager)=>{
        m.playersMoney[m.turn] += rent;
        m.playersMoney[asset.owner] -= rent;
  
        const gameEvent = {
          type: AC.REACTION,
          [AC.REACTION]: {
            type: AC.TRANSACTIONS,
            [AC.TRANSACTIONS]: [
              {
                from: asset.owner,
                to: m.turn,
                type: AC.MONEY,
                money: rent,
              },
            ],
          },
        };
        await this.gameService.sendGameEvent(m.game.id, gameEvent);
      });
      // UNDO END
    }
    else if (asset.item.name === 'incoming_tax') {
      // will be made decision TAX or PAY
      const PAY = Number(asset.item.additional.pay);
      m.playersMoney[m.turn] -= PAY;
    
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.TRANSACTIONS,
          [AC.TRANSACTIONS]: [
            {
              from: m.turn,
              to: 'game',
              type: AC.MONEY,
              money: PAY,
            },
          ],
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
      
      // UNDO START
      this.undoAction(m, async(m: IManager) => {
        m.playersMoney[m.turn] += PAY;
  
        const gameEvent = {
          type: AC.REACTION,
          [AC.REACTION]: {
            type: AC.TRANSACTIONS,
            [AC.TRANSACTIONS]: [
              {
                from: 'game',
                to: m.turn,
                type: AC.MONEY,
                money: PAY,
              },
            ],
          },
        };
        await this.gameService.sendGameEvent(m.game.id, gameEvent);
      })
      // UNDO END
    }
    else if (asset.item.name === 'patent_infringement') {
      const PAY = Number(asset.item.additional.pay);
      m.playersMoney[m.turn] -= PAY;
    
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.TRANSACTIONS,
          [AC.TRANSACTIONS]: [
            {
              from: m.turn,
              to: 'game',
              type: AC.MONEY,
              money: PAY,
            },
          ],
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
  
      // UNDO START
      this.undoAction(m, async(m: IManager) => {
        m.playersMoney[m.turn] += PAY;
    
        const gameEvent = {
          type: AC.REACTION,
          [AC.REACTION]: {
            type: AC.TRANSACTIONS,
            [AC.TRANSACTIONS]: [
              {
                from: 'game',
                to: m.turn,
                type: AC.MONEY,
                money: PAY,
              },
            ],
          },
        };
        await this.gameService.sendGameEvent(m.game.id, gameEvent);
      })
      // UNDO END
    }
    else if (asset.item.name === 'go_to_jail') {
      return this.goToJail(m, m.turn);
    }
    else if (asset.item.name === 'chance') {
      let chanceCard;
      let count = 0;
      while (1) {
        chanceCard = m.assets[m.map.chances[0]];
        m.map.chances.push(m.map.chances.splice(0, 1)[0]);
        if (chanceCard.owner === 'game') {
          break;
        }
        chanceCard = null;
        if (count >= m.map.chances.length) {
          break;
        }
        count++;
      }
    
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.CHANCE_CARD,
          [AC.CHANCE_CARD]: {
            card: chanceCard.id,
            player: m.turn,
          },
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
    }
    else if (asset.item.name === 'lottery') {
      let lotteryCard;
      let count = 0;
      while (1) {
        lotteryCard = m.assets[m.map.lotteries[0]];
        m.map.lotteries.push(m.map.lotteries.splice(0, 1)[0]);
        if (lotteryCard.owner === 'game') {
          break;
        }
        lotteryCard = null;
        if (count >= m.map.lotteries.length) {
          break;
        }
        count++;
      }
    
      const gameEvent = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.LOTTERY_CARD,
          [AC.LOTTERY_CARD]: {
            card: lotteryCard.id,
            player: m.turn,
          },
        },
      };
      await this.gameService.sendGameEvent(m.game.id, gameEvent);
    }
  }
  
  async gameCycle(m: IManager, options: IOptions = {cFlag: false}): Promise<void> {
    const {cFlag, sameTurn} = options;
    let moneyAtStart: boolean;
    
    m.turnCounter++;

    try {
      m.assetUpgraded = [];
      
      if(m.turnCounter === 50){
        arrayShuffle(m.map.lotteries);
        arrayShuffle(m.map.chances);
      }
      
      // gameCycle
      if(!cFlag){
        m.lastTurn = [];
      }
      // Check if there is players to play if not STOP
      if (Object.keys(m.playersOnline).every(pId => !m.playersOnline[pId])) {
        await this.gameService.eraseGameInfo(m.game.id);
        
        return;
      } else if (await this.endGameCheck(m)) {
        await this.endGame(m);
        
        return;
      }
      
      if (!sameTurn && !m.turnDoubles && !cFlag) {
        /** init props **/
        // Offers count for each player
        Object.keys(m.playersPosition).forEach(k => {
          m.offersLimits[k] = GC.maxOfferLimit;
        });

        //next players move
        await this.setSubPhase(m, AC.PLAYERS_TURN);

        const nextPlayerMove = {
          type: AC.SUB_PHASE,
          [AC.SUB_PHASE]: {
            value: AC.PLAYERS_TURN,
            playerId: m.turn,
          },
        };
        await this.gameService.sendGameEvent(m.game.id, nextPlayerMove);

        // wait 1 sec
        await new Promise(r => setTimeout(r, 1000));
        /** init props **/
      }

      let dices: number[] = m.prevDices;
      if (!cFlag) {
        // roll dice
        dices = await this.rollDiceOperation(m);

        if (m.turnDoubles >= 3) {
          await this.goToJail(m, m.turn);
        }
        else if (m.playersInJail[m.turn]) {
          m.playersInJail[m.turn]--;
          if (m.playersInJail[m.turn] === 0 || dices[0] === dices[1]) {
            //UNDO START
            const buff = m.playersInJail[m.turn];
            this.undoAction(m, async(m:IManager)=>{
              m.playersInJail[m.turn] = buff;
            });
            //UNDO END
            delete m.playersInJail[m.turn];
          } else {
            if(!sameTurn){
              const date = Date.now();
              m.timer = { value: 123, date, t: null, verification: [m.turn], entity: null};
              const timerStart = {
                type: AC.TIMER,
                [AC.TIMER]: {
                  value: m.timer.value - 3,
                  date: m.timer.date,
                  verification: m.timer.verification
                },
              };
              await this.gameService.sendGameEvent(m.game.id, timerStart);
  
              this.time(m, date, async () => {
                m.timer = { value: 3, date, t: null, verification: [], entity: null };
                const timerStart = {
                  type: AC.TIMER,
                  [AC.TIMER]: {
                    value: m.timer.value - 3,
                    date: m.timer.date,
                    verification: m.timer.verification
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, timerStart);
                await this.actionService.processAction(m, { type: AC.END_TURN }, m.turn);
              });
              m.timer.entity.tick();
            }
            return;
          }
        }
      }
      
      if (!cFlag && !sameTurn) {
        const date = Date.now();
        m.timer = { value: 123, date, t: null, verification: [m.turn], entity: null };
        const timerStart = {
          type: AC.TIMER,
          [AC.TIMER]: {
            value: m.timer.value - 3,
            date: m.timer.date,
            verification: m.timer.verification
          },
        };
        await this.gameService.sendGameEvent(m.game.id, timerStart);

        this.time(m, date, async () => {
          m.timer = { value: 3, date, t: null, verification: [], entity: null };
          const timerStart = {
            type: AC.TIMER,
            [AC.TIMER]: {
              value: m.timer.value - 3,
              date: m.timer.date,
              verification: m.timer.verification
            },
          };

          await this.gameService.sendGameEvent(m.game.id, timerStart);
          await this.actionService.processAction(m, { type: AC.END_TURN }, m.turn);
        });
        m.timer.entity.tick();
      }

      if (m.playersInJail[m.turn]) {
        return;
      }

      // change player position
      const move = dices.reduce((acc, current) => acc + current, 0);
      const made = await this.makeMove(m, m.turn, move);

      const changedPosition = {
        type: AC.POSITION,
        [AC.POSITION]: {
          playerId: m.turn,
          data: made,
        },
      };
      await this.gameService.sendGameEvent(m.game.id, changedPosition);
      
      // UNDO START
      this.undoAction(m,  async (m: IManager) => {
        const made = await this.makeMove(m, m.turn, -move);
  
        const changedPosition = {
          type: AC.POSITION,
          [AC.POSITION]: {
            playerId: m.turn,
            data: made,
          },
        };
        await this.gameService.sendGameEvent(m.game.id, changedPosition);
      });
      // UNDO END

      if (made.newPos < made.oldPos) {
        moneyAtStart = true;
        await this.calcHouseCount(m);
        await this.calcHotelsCount(m);
      }
      // asset actions

      // take rent if it is
      await this.stepAction({m, asset: m.assets[m.map.steps[made.newPos]]});
      // give money at circle start
      if (moneyAtStart) {
        const money = m.game.settings.circleMoney;
        m.playersMoney[m.turn] += money;

        const gameEvent = {
          type: AC.REACTION,
          [AC.REACTION]: {
            type: AC.TRANSACTIONS,
            [AC.TRANSACTIONS]: [
              {
                from: 'game',
                to: m.turn,
                type: AC.MONEY,
                money: money,
              },
            ],
          },
        };
        await this.gameService.sendGameEvent(m.game.id, gameEvent);
  
        // UNDO START
        this.undoAction(m,  async (m: IManager) => {
          m.playersMoney[m.turn] -= money;
  
          const gameEvent = {
            type: AC.REACTION,
            [AC.REACTION]: {
              type: AC.TRANSACTIONS,
              [AC.TRANSACTIONS]: [
                {
                  from: m.turn,
                  to: 'game',
                  type: AC.MONEY,
                  money: money,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, gameEvent);
        });
        // UNDO END
      }
      
    } catch (e) {
      console.log(e);
    } finally {
      m.wasSameTurn = sameTurn;
    }

  }
  
  undoAction(m: IManager, action){
    if(m.subPhase === AC.PLAYERS_TURN){
      m.lastTurn.push(action)
    }
  }
}


class Manager implements IManager {
  id: string;
  game: IGame | null;
  map: IXGameMap;
  playersMoney: {
    [key: string]: number
  };
  playersPosition: {
    [key: string]: number
  };
  playersInJail: {
    [key: string]: number  // key: playerId ; value: number of turns
  };
  playersOnline: {
    [key: string]: boolean
  };
  playersPauses: {
    [key: string]: number
  };
  playersLeavePauses: {
    [key: string]: {t: null | Timeout, value: number, date: number}
  };
  currentScript: {name: string, players: any} | null; // scripts for player to exec on front
  playersSequence: string[];
  assets: {
    [key: string]: IXAsset
  };
  timer: {
    date: number,
    value: number,
    verification: string[],
    t: Timeout,
    entity: any,
    pause?: boolean
  } | null;
  pauseTimer: {
    date: number,
    entity: any,
    playerId
  } | null;
  offersLimits: {
    [key: string]: number
  };
  itemGroupsAssets: {
    [key: string]: string[]
  };
  subPhase: string;
  turnCounter: number;
  turn: string | null; // player turn
  turnDoubles: number;
  chanceIndex: number;
  lotteryIndex: number;
  prevDices: number[];
  counter: any;
  dicesD: any;
  houseCount: number;
  hotelCount: number;
  win: string;
  noRequests: boolean;
  lastTurn: any[];
  assetUpgraded: string[];
  wasSameTurn: boolean;


  constructor() {
    this.id = uuid.v4();
    this.game = null;
    this.map = undefined;
    this.subPhase = undefined;
    this.playersMoney = {};
    this.playersPosition = {};
    this.playersInJail = {};
    this.playersOnline = {};
    this.playersPauses = {};
    this.playersLeavePauses = {};
    this.playersSequence = [];
    this.currentScript = null;
    this.assets = {};
    this.timer = null;
    this.assetUpgraded = [];
    this.offersLimits = {};
    this.itemGroupsAssets = {};
    this.turn = null;
    this.turnCounter = 0;
    this.pauseTimer = null;
    this.turnDoubles = 0;
    this.chanceIndex = 0;
    this.lotteryIndex = 0;
    this.prevDices = [];
    this.lastTurn = [];
    this.houseCount = 0;
    this.hotelCount = 0;
    this.win = '';
    this.noRequests = false;
    this.wasSameTurn = false;
    
    // Dummy data
    this.counter = 0;
    //this.chances = ['chance_15', 'chance_11', 'chance_12'];
    //this.lotteries = ['lottery_15', 'lottery_12', 'lottery_13'];
    //this.dicesD = [[1, 1], [1, 2], [1, 1], [1, 2], [6, 6], [1, 2], [6, 6], [1, 2]];
  }
}

