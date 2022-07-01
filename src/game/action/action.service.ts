import {
  Injectable, Logger, Inject, forwardRef,
} from '@nestjs/common';
import * as uuid from 'uuid';

import { IXAsset } from '../../interfaces/asset.interface';
import { GameService } from '../game.service';
import { ManagerService } from '../manager/manager.service';
import { IManager } from '../../interfaces/manager.interface';
import { actionConsts as AC, gameConsts } from '../game.constants';
import { Timer } from '../../util';
import Timeout = NodeJS.Timeout;
import { async } from 'rxjs/internal/scheduler/async';

/** asset service */
@Injectable()
export class ActionService {
  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    @Inject(forwardRef(() => ManagerService))
    private readonly gameManager: ManagerService,
  ) {
  }
  
  async processCardAction(m: IManager, cardId: string, data: any): Promise<void> {
    const card = m.assets[cardId];
    const { to, from, value, action, jailRelease, step, rent, script} = card.item.additional;
    
    const giveCardBack = async({undo = true}:{undo?:boolean}) => {
      //UNDO START
      if(undo){
        const buff = card.owner = 'game';
        this.gameManager.undoAction(m, async (m: IManager) => {
          card.owner = buff;
    
          const transaction = {
            type: AC.REACTION,
            [AC.REACTION]: {
              type: AC.TRANSACTIONS,
              [AC.TRANSACTIONS]: [
                {
                  from: 'game',
                  to: data.playerId,
                  type: AC.ASSET,
                  asset: cardId,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, transaction);
        });
      }
      //UNDO END
  
      card.owner = 'game'; // Give card back to game
  
      const transaction = {
        type: AC.REACTION,
        [AC.REACTION]: {
          type: AC.TRANSACTIONS,
          [AC.TRANSACTIONS]: [
            {
              from: data.playerId,
              to: 'game',
              type: AC.ASSET,
              asset: cardId,
            },
          ],
        },
      };
      await this.gameService.sendGameEvent(m.game.id, transaction);
    };
    
    switch (script) {
      case 'script_0': {
        
        //UNDO START
        const buff = card.owner = 'game';
        this.gameManager.undoAction(m, async (m: IManager) => {
          card.owner = buff;
          
          const transaction = {
            type: AC.REACTION,
            [AC.REACTION]: {
              type: AC.TRANSACTIONS,
              [AC.TRANSACTIONS]: [
                {
                  from: 'game',
                  to: data.playerId,
                  type: AC.ASSET,
                  asset: cardId,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, transaction);
        });
        //UNDO END
        
        card.owner = 'game'; // Give card back to game
        
        const transaction = {
          type: AC.REACTION,
          [AC.REACTION]: {
            type: AC.TRANSACTIONS,
            [AC.TRANSACTIONS]: [
              {
                from: data.playerId,
                to: 'game',
                type: AC.ASSET,
                asset: cardId,
              },
            ],
          },
        };
        await this.gameService.sendGameEvent(m.game.id, transaction);
        
        const event = {
          type: AC.SCRIPT_0,
          [AC.SCRIPT_0]: [m.turn],
        };
        m.currentScript = { name: AC.SCRIPT_0, players: [m.turn] };
        await this.gameService.sendGameEvent(m.game.id, event);
        
        return;
      }
      case 'script_2': {
        
        //UNDO START
        const buff = card.owner = 'game';
        this.gameManager.undoAction(m, async (m: IManager) => {
          card.owner = buff;
          
          const transaction = {
            type: AC.REACTION,
            [AC.REACTION]: {
              type: AC.TRANSACTIONS,
              [AC.TRANSACTIONS]: [
                {
                  from: 'game',
                  to: data.playerId,
                  type: AC.ASSET,
                  asset: cardId,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, transaction);
        });
        //UNDO END
        
        card.owner = 'game'; // Give card back to game
        
        const transaction = {
          type: AC.REACTION,
          [AC.REACTION]: {
            type: AC.TRANSACTIONS,
            [AC.TRANSACTIONS]: [
              {
                from: data.playerId,
                to: 'game',
                type: AC.ASSET,
                asset: cardId,
              },
            ],
          },
        };
        await this.gameService.sendGameEvent(m.game.id, transaction);
        
        const event = {
          type: AC.SCRIPT_2,
          [AC.SCRIPT_2]: [m.turn],
        };
        m.currentScript = { name: AC.SCRIPT_2, players: [m.turn] };
        await this.gameService.sendGameEvent(m.game.id, event);
        
        return;
      }
    }
    
    switch (action) {
      case 'go': {
        if (step) {
          if (step === 'jail') {
            await this.gameManager.goToJail(m, m.turn);
            break;
          } else if (jailRelease) {
            if (m.playersInJail[data.playerId] !== undefined) {
              //UNDO START
              const buff = m.playersInJail[data.playerId];
              this.gameManager.undoAction(m, async (m: IManager) => {
                m.playersInJail[data.playerId] = buff;
                card.owner = data.playerId; // Give card back to game
                
                const transaction = {
                  type: AC.REACTION,
                  [AC.REACTION]: {
                    type: AC.TRANSACTIONS,
                    [AC.TRANSACTIONS]: [
                      {
                        from: 'game',
                        to: data.playerId,
                        type: AC.ASSET,
                        asset: cardId,
                      },
                    ],
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, transaction);
                
                const gameEvent = {
                  type: AC.REACTION,
                  [AC.REACTION]: {
                    type: AC.JAIL,
                    [AC.JAIL]: data.playerId,
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, gameEvent);
              });
              //UNDO END
              
              
              delete m.playersInJail[data.playerId];
              card.owner = 'game'; // Give card back to game
              
              const transaction = {
                type: AC.REACTION,
                [AC.REACTION]: {
                  type: AC.TRANSACTIONS,
                  [AC.TRANSACTIONS]: [
                    {
                      from: data.playerId,
                      to: 'game',
                      type: AC.ASSET,
                      asset: cardId,
                    },
                  ],
                },
              };
              await this.gameService.sendGameEvent(m.game.id, transaction);
              
              const gameEvent = {
                type: AC.REACTION,
                [AC.REACTION]: {
                  type: AC.JAIL_REDEMPTION,
                  player: data.playerId,
                  result: true,
                },
              };
              await this.gameService.sendGameEvent(m.game.id, gameEvent);
              
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
          }
          
          const made = await this.gameManager.goToStep(m, step, m.turn);
          
          await this.gameManager.stepAction({ m, asset: m.assets[m.map.steps[made.newPos]] });
          
          // if new round
          if (made.newPos < made.oldPos) {
            await this.gameManager.calcHouseCount(m);
            
            const money = m.game.settings.circleMoney;
            m.playersMoney[m.turn] += money;
            
            const gameEvent = {
              type: AC.REACTION,
              [AC.REACTION]: {
                type: AC.TRANSACTIONS,
                [AC.TRANSACTIONS]: [
                  {
                    from: 'game',
                    to: data.playerId,
                    type: AC.MONEY,
                    money: money,
                  },
                ],
              },
            };
            await this.gameService.sendGameEvent(m.game.id, gameEvent);
            
            //UNDO START
            this.gameManager.undoAction(m, async (m: IManager) => {
              const money = m.game.settings.circleMoney;
              m.playersMoney[m.turn] -= money;
              
              const gameEvent = {
                type: AC.REACTION,
                [AC.REACTION]: {
                  type: AC.TRANSACTIONS,
                  [AC.TRANSACTIONS]: [
                    {
                      from: data.playerId,
                      to: 'game',
                      type: AC.MONEY,
                      money: money,
                    },
                  ],
                },
              };
              await this.gameService.sendGameEvent(m.game.id, gameEvent);
            });
            //UNDO END
          }
        }
        break;
      }
      case 'transaction': {
        let fromId: string;
        let toId: string;
        const money = Number(value);
        
        if (from === 'game' || to === 'game') {
          fromId = from === 'game' ? from : data.playerId;
          toId = to === 'game' ? to : data.playerId;
          
          /** Perform action*/
          if (fromId !== 'game') {
            m.playersMoney[fromId] -= money;
          }
          if (toId !== 'game') {
            m.playersMoney[toId] += money;
          }
          
          const gameEvent = {
            type: AC.REACTION,
            reaction: {
              type: AC.TRANSACTIONS,
              [AC.TRANSACTIONS]: [
                {
                  from: fromId,
                  to: toId,
                  type: AC.MONEY,
                  money,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, gameEvent);
          
          //UNDO START
          this.gameManager.undoAction(m, async (m: IManager) => {
            /** Perform action*/
            if (fromId !== 'game') {
              m.playersMoney[fromId] += money;
            }
            if (toId !== 'game') {
              m.playersMoney[toId] -= money;
            }
            
            const gameEvent = {
              type: AC.REACTION,
              reaction: {
                type: AC.TRANSACTIONS,
                [AC.TRANSACTIONS]: [
                  {
                    from: toId,
                    to: fromId,
                    type: AC.MONEY,
                    money,
                  },
                ],
              },
            };
            await this.gameService.sendGameEvent(m.game.id, gameEvent);
          });
          //UNDO END
        } else if (from === 'all') {
          const gameEvent = {
            type: AC.REACTION,
            reaction: {
              type: AC.TRANSACTIONS,
              [AC.TRANSACTIONS]: m.playersSequence.map(pId => {
                if (pId !== data.playerId) {
                  m.playersMoney[pId] -= money;
                  m.playersMoney[data.playerId] += money;
                  
                  return {
                    from: pId,
                    to: data.playerId,
                    type: AC.MONEY,
                    money,
                  };
                }
              }),
            },
          };
          await this.gameService.sendGameEvent(m.game.id, gameEvent);
          
          //UNDO START
          this.gameManager.undoAction(m, async (m: IManager) => {
            const gameEvent = {
              type: AC.REACTION,
              reaction: {
                type: AC.TRANSACTIONS,
                [AC.TRANSACTIONS]: m.playersSequence.map(pId => {
                  if (pId !== data.playerId) {
                    m.playersMoney[pId] += money;
                    m.playersMoney[data.playerId] -= money;
                    
                    return {
                      from: data.playerId,
                      to: pId,
                      type: AC.MONEY,
                      money,
                    };
                  }
                }),
              },
            };
            await this.gameService.sendGameEvent(m.game.id, gameEvent);
          });
          //UNDO END
        } else {
        
        }
        break;
      }
      case 'buy half price': {
        const asset = m.assets[data.asset];
        const cost = Math.floor(asset.item.cost / 2);
        if (asset.owner === 'game') {  // if there are no owners
          if (m.playersPosition[data.playerId] === m.map.steps.indexOf(asset.id)) { // if player is at the same step
            if (m.playersMoney[data.playerId] >= cost) { // if player has enough money
              /** Perform action*/
              card.owner = 'game'; // Give card back to game
              asset.owner = data.playerId;
              m.playersMoney[data.playerId] -= cost;
              
              const gameEvent = {
                type: AC.REACTION,
                reaction: {
                  type: AC.TRANSACTIONS,
                  [AC.TRANSACTIONS]: [
                    {
                      from: 'game',
                      to: data.playerId,
                      type: AC.ASSET,
                      asset: asset.id,
                    },
                    {
                      from: data.playerId,
                      to: 'game',
                      type: AC.MONEY,
                      money: cost,
                    },
                    {
                      from: data.playerId,
                      to: 'game',
                      type: AC.ASSET,
                      asset: cardId,
                    },
                  ],
                },
              };
              await this.gameService.sendGameEvent(m.game.id, gameEvent);
              
              //UNDO START
              this.gameManager.undoAction(m, async (m: IManager) => {
                card.owner = data.playerId;
                asset.owner = 'game';
                m.playersMoney[data.playerId] += cost;
                
                const gameEvent = {
                  type: AC.REACTION,
                  reaction: {
                    type: AC.TRANSACTIONS,
                    [AC.TRANSACTIONS]: [
                      {
                        from: data.playerId,
                        to: 'game',
                        type: AC.ASSET,
                        asset: asset.id,
                      },
                      {
                        from: 'game',
                        to: data.playerId,
                        type: AC.MONEY,
                        money: cost,
                      },
                      {
                        from: 'game',
                        to: data.playerId,
                        type: AC.ASSET,
                        asset: cardId,
                      },
                    ],
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, gameEvent);
              });
              //UNDO END
              
            } else {
              throw new Error(AC.NOT_ENOUGH_MONEY);
            }
          } else {
            throw new Error(AC.NO_ACCESS);
          }
        }
        else if (asset.owner === from) {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        } else {
          throw new Error(AC.NO_ACCESS);
        }
        break;
      }
      case 'rent': {
        let count = 0;
        
        if (rent === 'upgrade') {
          m.map.steps.map(aId => {
            const asset = m.assets[aId];
            
            if (asset.owner === data.playerId) {
              count += asset.lvl;
            }
          });
        }
        else if (rent === 'step') {
          m.map.steps.map(aId => {
            const asset = m.assets[aId];
            
            if (asset.owner === data.playerId) {
              count++;
            }
          });
        }
        
        const money = Number(value) * count;
        m.playersMoney[m.turn] -= money;
        
        const gameEvent = {
          
          type: AC.REACTION,
          [AC.REACTION]: {
            type: AC.TRANSACTIONS,
            [AC.TRANSACTIONS]: [
              {
                from: data.playerId,
                to: 'game',
                type: AC.MONEY,
                money,
              },
            ],
          },
        };
        await this.gameService.sendGameEvent(m.game.id, gameEvent);
        
        //UNDO START
        this.gameManager.undoAction(m, async (m: IManager) => {
          m.playersMoney[m.turn] += money;
          
          const gameEvent = {
            
            type: AC.REACTION,
            [AC.REACTION]: {
              type: AC.TRANSACTIONS,
              [AC.TRANSACTIONS]: [
                {
                  from: 'game',
                  to: data.playerId,
                  type: AC.MONEY,
                  money,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, gameEvent);
        });
        //UNDO END
        
        break;
      }
      case 'upgrade': { // upgrade free
        const asset = m.assets[data.asset];
        if (asset.owner === data.playerId) { // if u are the owner
          if (asset.item.canBeUpgraded) {
            const monopoly = m.itemGroupsAssets[asset.item.additional.group];
            
            if (monopoly && monopoly.every(aId => m.assets[aId].owner === data.playerId)) { // if u have a monopoly
              const lvl = asset.lvl + 1;
              
              if (asset.item.additional.rent[lvl] !== undefined
                && !monopoly.some(aId => Math.abs(m.assets[aId].lvl - lvl) > 1)) { // if item has lvl and all cells has the same lvl
                
                if (lvl < 5 && m.houseCount || lvl === 5 && m.hotelCount) {
                  
                  if (!m.assetUpgraded.includes(asset.id)) { // wasn't upgraded
                    /** Perform action*/
                      //UNDO START
                    const buff = card.owner;
                    this.gameManager.undoAction(m, async (m: IManager) => {
                      m.assets[asset.id].lvl--;
                      card.owner = buff;
                      
                      const gameEvent = {
                        type: AC.REACTION,
                        reaction: {
                          type: AC.TRANSACTIONS,
                          [AC.TRANSACTIONS]: [
                            {
                              from: 'game',
                              to: data.playerId,
                              type: AC.DOWNGRADE,
                              asset: asset.id,
                              lvl: m.assets[asset.id].lvl,
                            },
                            {
                              from: 'game',
                              to: data.playerId,
                              type: AC.ASSET,
                              asset: cardId,
                            },
                          ],
                        },
                      };
                      await this.gameService.sendGameEvent(m.game.id, gameEvent);
                    });
                    //UNDO END
                    
                    card.owner = 'game'; // Give card back to game
                    m.assets[asset.id].lvl++;
                    
                    const gameEvent = {
                      type: AC.REACTION,
                      reaction: {
                        type: AC.TRANSACTIONS,
                        [AC.TRANSACTIONS]: [
                          {
                            from: 'game',
                            to: data.playerId,
                            type: AC.UPGRADE,
                            asset: asset.id,
                            lvl: asset.lvl,
                          },
                          {
                            from: data.playerId,
                            to: 'game',
                            type: AC.ASSET,
                            asset: cardId,
                          },
                        ],
                      },
                    };
                    await this.gameService.sendGameEvent(m.game.id, gameEvent);
                    
                    if (lvl === 5) {
                      m.hotelCount--;
                      
                      const hotelCountEvent = {
                        type: AC.REACTION,
                        [AC.REACTION]: {
                          type: AC.HOTEL_COUNT,
                          [AC.HOTEL_COUNT]: m.hotelCount,
                        },
                      };
                      await this.gameService.sendGameEvent(m.game.id, hotelCountEvent);
                      
                      //UNDO START
                      this.gameManager.undoAction(m, async (m: IManager) => {
                        m.hotelCount++;
                        
                        const hotelCountEvent = {
                          type: AC.REACTION,
                          [AC.REACTION]: {
                            type: AC.HOTEL_COUNT,
                            [AC.HOTEL_COUNT]: m.hotelCount,
                          },
                        };
                        await this.gameService.sendGameEvent(m.game.id, hotelCountEvent);
                      });
                      //UNDO END
                    } else {
                      m.houseCount--;
                      
                      const houseCountEvent = {
                        type: AC.REACTION,
                        [AC.REACTION]: {
                          type: AC.HOUSE_COUNT,
                          [AC.HOUSE_COUNT]: m.houseCount,
                        },
                      };
                      await this.gameService.sendGameEvent(m.game.id, houseCountEvent);
                      
                      //UNDO START
                      this.gameManager.undoAction(m, async (m: IManager) => {
                        m.houseCount++;
                        
                        const houseCountEvent = {
                          type: AC.REACTION,
                          [AC.REACTION]: {
                            type: AC.HOUSE_COUNT,
                            [AC.HOUSE_COUNT]: m.houseCount,
                          },
                        };
                        await this.gameService.sendGameEvent(m.game.id, houseCountEvent);
                      });
                      //UNDO END
                    }
                  } else {
                    throw new Error(AC.SOMETHING_WENT_WRONG);
                  }
                } else {
                  throw new Error(AC.VALUE_LIMIT);
                }
              } else {
                throw new Error(AC.SOMETHING_WENT_WRONG);
              }
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
          } else {
            throw new Error(AC.SOMETHING_WENT_WRONG);
          }
        }
        else {
          throw new Error(AC.NO_ACCESS);
        }
        break;
      }
      case 'exit': {
        if (m.playersInJail[data.playerId] !== undefined) {
          
          //UNDO START
          const jailBuff = m.playersInJail[data.playerId];
          
          this.gameManager.undoAction(m, async (m: IManager) => {
            m.playersInJail[data.playerId] = jailBuff;
          });
  
          delete m.playersInJail[data.playerId];
          await giveCardBack({});
          
          //UNDO START
          this.gameManager.undoAction(m, async (m: IManager) => {
            const gameEvent = {
              type: AC.REACTION,
              [AC.REACTION]: {
                type: AC.JAIL,
                [AC.JAIL]: data.playerId,
              },
            };
            await this.gameService.sendGameEvent(m.game.id, gameEvent);
          });
          //UNDO END
          
          const gameEvent = {
            type: AC.REACTION,
            [AC.REACTION]: {
              type: AC.JAIL_REDEMPTION,
              player: data.playerId,
              result: true,
            },
          };
          await this.gameService.sendGameEvent(m.game.id, gameEvent);
          await this.gameManager.gameCycle(m, {cFlag: true});
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
        break;
      }
      case 'reroll': {
        if (m.lastTurn && m.timer.value > 5) {
          m.noRequests = true;
  
          await giveCardBack({undo: false});
          await Promise.all(m.lastTurn.reverse().map(async action => {
            await action(m);
            await new Promise(r => setTimeout(r, 500));
          }));
          // wait 2 sec
          // await new Promise(r => setTimeout(r, 2000));
          // clearTimeout(m.timer.t);
          // const timerStart = {
          //   type: AC.TIMER,
          //   [AC.TIMER]: {
          //     value: 0,
          //     date: m.timer.date,
          //     verification: [],
          //   },
          // };
          //await this.gameService.sendGameEvent(m.game.id, timerStart);
          await this.gameManager.gameCycle(m, {sameTurn: true});
          m.noRequests = false;
          return;
        }
      }
      case 'pass_turn': {
        if (m.lastTurn) {
          m.noRequests = true;
          
          await giveCardBack({undo: false});
          await Promise.all(m.lastTurn.reverse().map(async action => {
            await action(m);
            await new Promise(r => setTimeout(r, 1000));
          }));
          clearTimeout(m.timer.t);
          const timerStart = {
            type: AC.TIMER,
            [AC.TIMER]: {
              value: 0,
              date: m.timer.date,
              verification: [],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, timerStart);
          await this.gameManager.gameCycle(m);
          m.noRequests = false;
          return;
        }
      }
      case 'bet': {
        await giveCardBack({});
        const event = {
          type: AC.BET,
          [AC.BET]: {playerId: m.turn, cardId},
        };
        await this.gameService.sendGameEvent(m.game.id, event);
        
        return;
      }
    }
  }
  
  async processAction(m: IManager, action: any, from: string): Promise<void> {
    try {
      const { type } = action;
      
      // проверить есть ли еще игра
      if (!m || !m.game || m.noRequests) {
        return;
      }
      
      if (type === AC.MESSAGE) {
        const message = action[type];
        const date = Date.now();
        
        const messageObject = {
          id: `msg-${from}-${date}`,
          from: from,
          type: AC.MESSAGE,
          actionType: AC.MESSAGE,
          date,
          text: message,
        };
        
        const actionToSend = {
          type: AC.MESSAGE,
          [AC.MESSAGE]: messageObject,
        };
        await this.gameService.sendGameEvent(m.game.id, actionToSend);
      }
      else if (type === AC.VERIFY_TIMER) {
        if (m.timer.verification.includes(from) && m.timer.date === action[type]) {
          const index = m.timer.verification.indexOf(from);
          
          m.timer.verification.splice(index, 1);
          if (!m.timer.verification.length) {
            m.timer.value = 0;
          } else {
            const timerStart = {
              type: AC.TIMER,
              [AC.TIMER]: {
                value: m.timer.value - 3,
                date: m.timer.date,
                verification: m.timer.verification,
              },
            };
            
            await this.gameService.sendGameEvent(m.game.id, timerStart);
          }
        } else {
          throw new Error(AC.NO_ACCESS);
        }
      }
      else if (type === AC.PLAYER_CONNECTED) {
        if (from === 'game') {
          const pId = action[type];
          
          if (!m.playersOnline[pId]) {
            m.playersOnline[pId] = true;
          }
          
          const event = {
            type: AC.PLAYERS_ONLINE,
            [AC.PLAYERS_ONLINE]: m.playersOnline,
          };
          await this.gameService.sendGameEvent(m.game.id, event);
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.PLAYER_DISCONNECTED) {
        if (from === 'game') {
          m.playersOnline[action[type]] = false;
          
          const event = {
            type: AC.PLAYERS_ONLINE,
            [AC.PLAYERS_ONLINE]: m.playersOnline,
          };
          
          await this.gameService.sendGameEvent(m.game.id, event);
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.ACTIVATE_LEAVE_TIMER) {
        if (from === 'game') {
          const playerId = action[type];
          const leavePause = m.playersLeavePauses[playerId] as { t: null | Timeout, value: number, date: number };
          
          leavePause.t = setTimeout(() => {
            this.gameManager.bankrupt(m, playerId);
          }, leavePause.value * 1000);
          leavePause.date = Date.now();
          
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.DEACTIVATE_LEAVE_TIMER) {
        if (from === 'game') {
          const playerId = action[type];
          const leavePause = m.playersLeavePauses[playerId] as { t: null | Timeout, value: number, date: number };
          
          if (leavePause.date && leavePause.t && m.playersSequence.indexOf(playerId) >= 0) {
            clearTimeout(leavePause.t);
            const date = Date.now();
            const diff = leavePause.value - ((date - leavePause.date) / 1000);
            
            if (diff < 3) {
              await this.gameManager.bankrupt(m, playerId);
            }
            leavePause.date = date;
            leavePause.value = diff;
            leavePause.t = null;
            
            const event = {
              type: AC.PLAYER_LEAVE_INFO,
              [AC.PLAYER_LEAVE_INFO]: {
                playerId,
                value: leavePause.value,
              },
            };
            
            await this.gameService.sendGameEvent(m.game.id, event);
          }
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.PLAYER_EXIT) {
        const playerId = action[type];
        
        if (m.game.players[playerId] && from === playerId) {
          await this.gameManager.playerRemove(m, playerId);
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.SCRIPT_1) {
        //const data = action[type];
        
        if (m.currentScript && m.currentScript.name === type) {
          if (m.currentScript.players.includes(from)) {
            try {
              const prevScriptData = await this.gameService.getScriptData(`${m.game.id}-${AC.SCRIPT_0}`) as any;
              const dices = await this.gameManager.rollDiceOperation(m, true);
              
              if (prevScriptData.number === dices[0]) {
                
                m.playersMoney[from] -= 300;
                m.playersMoney[prevScriptData.from] += 300;
                
                const transaction = {
                  type: AC.REACTION,
                  [AC.REACTION]: {
                    type: AC.TRANSACTIONS,
                    [AC.TRANSACTIONS]: [
                      {
                        from,
                        to: prevScriptData.from,
                        type: AC.MONEY,
                        money: 300,
                      },
                    ],
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, transaction);
                
              }
            } catch (e) {
            
            }
            
          } else {
            throw new Error(AC.SOMETHING_WENT_WRONG);
          }
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.SCRIPT_3) {
        //const data = action[type];
        if (m.currentScript && m.currentScript.name === type) {
          if (m.currentScript.players.includes(from)) {
            try {
              const prevScriptData = await this.gameService.getScriptData(`${m.game.id}-${AC.SCRIPT_2}`) as any;
              const dices = await this.gameManager.rollDiceOperation(m, true);
              
              if (prevScriptData.number === dices[0]) {
                await this.gameManager.goToJail(m, from);
              }
            } catch (e) {
              console.log(e);
            }
            
          } else {
            throw new Error(AC.SOMETHING_WENT_WRONG);
          }
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.PAUSE_ENABLE) {
        if (m.playersPauses[from] > 0 && !m.timer.pause && m.timer.value > 5) {
          
          m.playersPauses[from]--;
          const info = {
            type: AC.PAUSE_INFO,
            [AC.PAUSE_INFO]: {
              pausesLeft: m.playersPauses,
              pauseMaxValue: gameConsts.pauseMaxValue,
            },
          };
          await this.gameService.sendGameEvent(m.game.id, info, from);
          
          const pause = {
            type: AC.PAUSE_ENABLE,
            [AC.PAUSE_ENABLE]: {
              playerId: from,
            },
          };
          await this.gameService.sendGameEvent(m.game.id, pause);
          
          m.pauseTimer = {
            playerId: from,
            date: Date.now(),
            entity: Timer({
              value: gameConsts.pauseMaxValue, pause: false, onTick: () => {
              }, onEnd: async () => {
                const info = {
                  type: AC.PAUSE_DISABLE,
                };
                await this.gameService.sendGameEvent(m.game.id, info);
                
                m.timer.pause = false;
                m.timer.entity.tick();
              },
            }),
          };
          m.pauseTimer.entity.tick();
          m.timer.pause = true;
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (type === AC.PAUSE_DISABLE) {
        if (m.pauseTimer.playerId === from) {
          
          if (m.pauseTimer) {
            m.pauseTimer.entity.clear();
            
            const info = {
              type: AC.PAUSE_DISABLE,
            };
            await this.gameService.sendGameEvent(m.game.id, info);
            
            m.timer.pause = false;
            m.timer.entity.tick();
          }
          
        } else {
          throw new Error(AC.SOMETHING_WENT_WRONG);
        }
      }
      else if (m.subPhase === AC.PLAYERS_TURN) {
        if (m.turn === from) {
          
          if (type === AC.REQUEST) {
            const { type, asset, value } = action.request;
            
            const asset_object = m.assets[asset] as IXAsset;
            const assetCost = asset_object.item.cost;
            
            if (asset && !asset_object) { // if not exist
              throw new Error(AC.ASSET_NO_EXIST);
            }
            
            if (type === AC.BUY) {
              if (asset_object.owner === 'game') {  // if there are no owners
                if (m.playersPosition[from] === m.map.steps.indexOf(asset)) { // if player is at the same step
                  if (m.playersMoney[from] >= assetCost) { // if player has enough money
                    /** Perform action*/
                    asset_object.owner = from;
                    m.playersMoney[from] -= assetCost;
                    
                    const gameEvent = {
                      type: AC.REACTION,
                      reaction: {
                        type: AC.TRANSACTIONS,
                        [AC.TRANSACTIONS]: [
                          {
                            from: 'game',
                            to: from,
                            type: AC.ASSET,
                            asset,
                          },
                          {
                            from,
                            to: 'game',
                            type: AC.MONEY,
                            money: assetCost,
                          },
                        ],
                      },
                    };
                    await this.gameService.sendGameEvent(m.game.id, gameEvent);
                    
                    //UNDO START
                    this.gameManager.undoAction(m, async(m: IManager) => {
                      asset_object.owner = 'game';
                      m.playersMoney[from] += assetCost;
                      
                      const gameEvent = {
                        type: AC.REACTION,
                        reaction: {
                          type: AC.TRANSACTIONS,
                          [AC.TRANSACTIONS]: [
                            {
                              from: from,
                              to: 'game',
                              type: AC.ASSET,
                              asset,
                            },
                            {
                              from: 'game',
                              to: from,
                              type: AC.MONEY,
                              money: assetCost,
                            },
                          ],
                        },
                      };
                      this.gameService.sendGameEvent(m.game.id, gameEvent);
                    });
                    //UNDO END
                    
                  } else {
                    throw new Error(AC.NOT_ENOUGH_MONEY);
                  }
                } else {
                  throw new Error(AC.NO_ACCESS);
                }
              }
              else if (asset_object.owner === from) {
                throw new Error(AC.SOMETHING_WENT_WRONG);
              } else {
                throw new Error(AC.NO_ACCESS);
              }
            }
            else if (type === AC.MORTGAGE) {
              if (asset_object.owner === from) {  // if owner is "from"
                if (!asset_object.isMortgaged && asset_object.lvl === 0) { // if asset not already mortgaged
                  /** Perform action*/
                  asset_object.isMortgaged = true;
                  const money = Number(asset_object.item.additional.mortgage);
                  m.playersMoney[from] += Number(money);
                  
                  const gameEvent = {
                    type: AC.REACTION,
                    [AC.REACTION]: {
                      type: AC.TRANSACTIONS,
                      [AC.TRANSACTIONS]: [
                        {
                          from: 'game',
                          to: from,
                          type: AC.MONEY,
                          money,
                        },
                        {
                          from,
                          to: 'game',
                          type: AC.MORTGAGE,
                          asset,
                        },
                      ],
                    },
                  };
                  await this.gameService.sendGameEvent(m.game.id, gameEvent);
  
                  //UNDO START
                  this.gameManager.undoAction(m, async(m: IManager) => {
                    asset_object.isMortgaged = false;
                    m.playersMoney[from] -= Number(money);
  
                    const gameEvent = {
                      type: AC.REACTION,
                      [AC.REACTION]: {
                        type: AC.TRANSACTIONS,
                        [AC.TRANSACTIONS]: [
                          {
                            from: from,
                            to: 'game',
                            type: AC.MONEY,
                            money,
                          },
                          {
                            from: 'game',
                            to: from,
                            type: AC.REDEEM,
                            asset,
                          },
                        ],
                      },
                    };
                    await this.gameService.sendGameEvent(m.game.id, gameEvent);
                  });
                  //UNDO END
                } else {
                  throw new Error(AC.SOMETHING_WENT_WRONG);
                }
              } else {
                throw new Error(AC.NO_ACCESS);
              }
            }
            else if (type === AC.REDEEM) {
              if (asset_object.owner === from && asset_object.isMortgaged) {  // if owner is "from" and it's mortgaged
                let redeemCost = Number(asset_object.item.additional.mortgage);
                redeemCost += Math.round(redeemCost * 0.1);
                
                if (m.playersMoney[from] >= redeemCost) { // if player has enough money
                  /** Perform action*/
                  asset_object.isMortgaged = false;
                  m.playersMoney[from] -= redeemCost;
                  
                  
                  const gameEvent = {
                    type: AC.REACTION,
                    [AC.REACTION]: {
                      type: AC.TRANSACTIONS,
                      [AC.TRANSACTIONS]: [
                        {
                          from: 'game',
                          to: from,
                          type: AC.REDEEM,
                          asset,
                        },
                        {
                          from,
                          to: 'game',
                          type: AC.MONEY,
                          money: redeemCost,
                        },
                      ],
                    },
                  };
                  await this.gameService.sendGameEvent(m.game.id, gameEvent);
  
                  //UNDO START
                  this.gameManager.undoAction(m, async(m: IManager) => {
                    asset_object.isMortgaged = true;
                    m.playersMoney[from] += redeemCost;
    
                    const gameEvent = {
                      type: AC.REACTION,
                      [AC.REACTION]: {
                        type: AC.TRANSACTIONS,
                        [AC.TRANSACTIONS]: [
                          {
                            from: 'game',
                            to: from,
                            type: AC.MONEY,
                            money: redeemCost,
                          },
                          {
                            from: from,
                            to: 'game',
                            type: AC.MORTGAGE,
                            asset,
                          },
                        ],
                      },
                    };
                    await this.gameService.sendGameEvent(m.game.id, gameEvent);
                  });
                  //UNDO END
                } else {
                  throw new Error(AC.NOT_ENOUGH_MONEY);
                }
              } else {
                throw new Error(AC.SOMETHING_WENT_WRONG);
              }
            }
            else if (type === AC.UPGRADE) {
              if (asset_object.owner === from) { // if u are the owner
                if (asset_object.item.canBeUpgraded
                  && m.playersMoney[from] >= Number(asset_object.item.additional.upcost)) {
                  const monopoly = m.itemGroupsAssets[asset_object.item.additional.group];
                  
                  if (monopoly
                    && monopoly.every(aId => m.assets[aId].owner === from)) { // if u have a monopoly
                    const lvl = asset_object.lvl + 1;
                    
                    if (asset_object.item.additional.rent[lvl] !== undefined
                      && !monopoly.some(aId => Math.abs(m.assets[aId].lvl - lvl) > 1)) { // if item has lvl and all cells has the same lvl
                      
                      if (lvl < 5 && m.houseCount || lvl === 5 && m.hotelCount) {
                        
                        if (!m.assetUpgraded.includes(asset_object.id)) { // wasn't upgraded
                          const money = Number(asset_object.item.additional.upcost);
                          /** Perform action*/
                          m.assets[asset].lvl++;
                          m.playersMoney[from] -= money;
                          
                          const gameEvent = {
                            type: AC.REACTION,
                            reaction: {
                              type: AC.TRANSACTIONS,
                              [AC.TRANSACTIONS]: [
                                {
                                  from: 'game',
                                  to: from,
                                  type: AC.UPGRADE,
                                  asset,
                                  lvl: asset_object.lvl,
                                },
                                {
                                  from,
                                  to: 'game',
                                  type: AC.MONEY,
                                  money,
                                },
                              ],
                            },
                          };
                          
                          await this.gameService.sendGameEvent(m.game.id, gameEvent);
  
                          //UNDO START
                          this.gameManager.undoAction(m, async(m: IManager) => {
                            m.assets[asset].lvl--;
                            m.playersMoney[from] += money;
  
                            const gameEvent = {
                              type: AC.REACTION,
                              reaction: {
                                type: AC.TRANSACTIONS,
                                [AC.TRANSACTIONS]: [
                                  {
                                    from: 'game',
                                    to: from,
                                    type: AC.DOWNGRADE,
                                    asset,
                                    lvl: asset_object.lvl,
                                  },
                                  {
                                    from: 'game',
                                    to: from,
                                    type: AC.MONEY,
                                    money,
                                  },
                                ],
                              },
                            };
  
                            await this.gameService.sendGameEvent(m.game.id, gameEvent);
                          });
                          //UNDO END
                          
                          if (lvl === 5) {
                            m.hotelCount--;
                            
                            const hotelCountEvent = {
                              type: AC.REACTION,
                              [AC.REACTION]: {
                                type: AC.HOTEL_COUNT,
                                [AC.HOTEL_COUNT]: m.hotelCount,
                              },
                            };
                            await this.gameService.sendGameEvent(m.game.id, hotelCountEvent);
  
                            //UNDO START
                            this.gameManager.undoAction(m, async(m: IManager) => {
                              m.hotelCount++;
  
                              const hotelCountEvent = {
                                type: AC.REACTION,
                                [AC.REACTION]: {
                                  type: AC.HOTEL_COUNT,
                                  [AC.HOTEL_COUNT]: m.hotelCount,
                                },
                              };
                              await this.gameService.sendGameEvent(m.game.id, hotelCountEvent);
                            });
                            //UNDO END
                          } else {
                            m.houseCount--;
                            
                            const houseCountEvent = {
                              type: AC.REACTION,
                              [AC.REACTION]: {
                                type: AC.HOUSE_COUNT,
                                [AC.HOUSE_COUNT]: m.houseCount,
                              },
                            };
                            await this.gameService.sendGameEvent(m.game.id, houseCountEvent);
  
                            //UNDO START
                            this.gameManager.undoAction(m, async(m: IManager) => {
                              m.houseCount++;
                              
                              const houseCountEvent = {
                                type: AC.REACTION,
                                [AC.REACTION]: {
                                  type: AC.HOUSE_COUNT,
                                  [AC.HOUSE_COUNT]: m.houseCount,
                                },
                              };
                              await this.gameService.sendGameEvent(m.game.id, houseCountEvent);
                            });
                            //UNDO END
                          }
                          
                          m.assetUpgraded.push(asset_object.id);
                        } else {
                          throw new Error(AC.SOMETHING_WENT_WRONG);
                        }
                        
                      } else {
                        throw new Error(AC.VALUE_LIMIT);
                      }
                    } else {
                      throw new Error(AC.SOMETHING_WENT_WRONG);
                    }
                  } else {
                    throw new Error(AC.SOMETHING_WENT_WRONG);
                  }
                } else {
                  throw new Error(AC.SOMETHING_WENT_WRONG);
                }
              }
              else {
                throw new Error(AC.NO_ACCESS);
              }
            }
            else if (type === AC.DOWNGRADE) {
              if (asset_object.owner === from) { // if u are the owner
                if (asset_object.item.canBeUpgraded) {
                  const monopoly = m.itemGroupsAssets[asset_object.item.additional.group];
                  if (monopoly
                    && monopoly.every(aId => m.assets[aId].owner === from)) { // if u have a monopoly
                    const lvl = asset_object.lvl - 1;
                    if (lvl >= 0 && !monopoly.some(aId => Math.abs(m.assets[aId].lvl - lvl) > 1)) { // if all cells has the same lvl
                      const money = Math.floor(Number(asset_object.item.additional.upcost) * 0.9);
                      /** Perform action*/
                      
                      if (m.assets[asset].lvl === 5) {
                        m.hotelCount++;
                        
                        const hotelCountEvent = {
                          type: AC.REACTION,
                          [AC.REACTION]: {
                            type: AC.HOTEL_COUNT,
                            [AC.HOTEL_COUNT]: m.hotelCount,
                          },
                        };
                        await this.gameService.sendGameEvent(m.game.id, hotelCountEvent);
  
                        //UNDO START
                        this.gameManager.undoAction(m, async(m: IManager) => {
                          m.hotelCount--;
  
                          const hotelCountEvent = {
                            type: AC.REACTION,
                            [AC.REACTION]: {
                              type: AC.HOTEL_COUNT,
                              [AC.HOTEL_COUNT]: m.hotelCount,
                            },
                          };
                          await this.gameService.sendGameEvent(m.game.id, hotelCountEvent);
                        });
                        //UNDO END
                      } else {
                        m.houseCount++;
                        
                        const houseCountEvent = {
                          type: AC.REACTION,
                          [AC.REACTION]: {
                            type: AC.HOUSE_COUNT,
                            [AC.HOUSE_COUNT]: m.houseCount,
                          },
                        };
                        await this.gameService.sendGameEvent(m.game.id, houseCountEvent);
  
                        //UNDO START
                        this.gameManager.undoAction(m, async(m: IManager) => {
                          m.houseCount--;
  
                          const houseCountEvent = {
                            type: AC.REACTION,
                            [AC.REACTION]: {
                              type: AC.HOUSE_COUNT,
                              [AC.HOUSE_COUNT]: m.houseCount,
                            },
                          };
                          await this.gameService.sendGameEvent(m.game.id, houseCountEvent);
                        });
                        //UNDO END
                      }
                      
                      m.assets[asset].lvl--;
                      m.playersMoney[from] += money;
                      
                      const gameEvent = {
                        type: AC.REACTION,
                        reaction: {
                          type: AC.TRANSACTIONS,
                          [AC.TRANSACTIONS]: [
                            {
                              from: 'game',
                              to: from,
                              type: AC.DOWNGRADE,
                              asset,
                              lvl: asset_object.lvl,
                            },
                            {
                              from: 'game',
                              to: from,
                              type: AC.MONEY,
                              money,
                            },
                          ],
                        },
                      };
                      await this.gameService.sendGameEvent(m.game.id, gameEvent);
                      
                      // remove from upgrade counter
                      const index = m.assetUpgraded.indexOf(asset.id);
                      if (index !== -1) {
                        m.assetUpgraded.splice(index, 1);
                      }
  
                      //UNDO START
                      this.gameManager.undoAction(m, async(m: IManager) => {
                        m.assets[asset].lvl++;
                        m.playersMoney[from] -= money;
  
                        const gameEvent = {
                          type: AC.REACTION,
                          reaction: {
                            type: AC.TRANSACTIONS,
                            [AC.TRANSACTIONS]: [
                              {
                                from: 'game',
                                to: from,
                                type: AC.UPGRADE,
                                asset,
                                lvl: asset_object.lvl,
                              },
                              {
                                from,
                                to: 'game',
                                type: AC.MONEY,
                                money,
                              },
                            ],
                          },
                        };
                        await this.gameService.sendGameEvent(m.game.id, gameEvent);
                        
                        if(index !== -1){
                          m.assetUpgraded.push(asset.id);
                        }
                      });
                      //UNDO END
                      
                    } else {
                      throw new Error(AC.SOMETHING_WENT_WRONG);
                    }
                  } else {
                    throw new Error(AC.SOMETHING_WENT_WRONG);
                  }
                } else {
                  throw new Error(AC.SOMETHING_WENT_WRONG);
                }
              } else {
                throw new Error(AC.NO_ACCESS);
              }
            }
          }
          else if (type === AC.END_TURN) {
            // wait 3 sec
            await new Promise(r => setTimeout(r, 3000));
            
            if (m.turnDoubles) {
              return this.gameManager.gameCycle(m);
            }
            
            await this.gameManager.setSubPhase(m, AC.PARTY);
            const nextSubPhase = {
              type: AC.SUB_PHASE,
              [AC.SUB_PHASE]: {
                value: AC.PARTY,
              },
            };
            await this.gameService.sendGameEvent(m.game.id, nextSubPhase);
            
            m.timer.date = Date.now();
            m.timer.value = 123;
            m.timer.verification = m.playersSequence.slice();
            const timerStart = {
              type: AC.TIMER,
              [AC.TIMER]: {
                value: m.timer.value - 3,
                date: m.timer.date,
                verification: m.timer.verification,
              },
            };
            
            this.gameService.sendGameEvent(m.game.id, timerStart);
            
            this.gameManager.time(m, m.timer.date, async () => {
              m.timer = { value: 3, date: m.timer.date, t: null, verification: [], entity: null };
              const timerStart = {
                type: AC.TIMER,
                [AC.TIMER]: {
                  value: m.timer.value - 3,
                  date: m.timer.date,
                  verification: m.timer.verification,
                },
              };
              
              await this.gameService.sendGameEvent(m.game.id, timerStart);
              
              // проверка на плюсовой баланс
              if (m.playersMoney[m.turn] < 0) {
                
                // предупреждение
                const warning = {
                  type: AC.BANKRUPT_WARNING,
                  [AC.BANKRUPT_WARNING]: m.turn,
                };
                await this.gameService.sendGameEvent(m.game.id, warning, m.turn);
                
                // если он в минусе запуск афтерпарти с уведомлением о возможном банкротитве
                await this.gameManager.setSubPhase(m, AC.AFTER_PARTY);
                const nextSubPhase = {
                  type: AC.SUB_PHASE,
                  [AC.SUB_PHASE]: {
                    value: AC.AFTER_PARTY,
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, nextSubPhase);
                m.timer.date = Date.now();
                m.timer.value = 123;
                m.timer.verification = m.playersSequence.slice();
                const timerStart = {
                  type: AC.TIMER,
                  [AC.TIMER]: {
                    value: m.timer.value - 3,
                    date: m.timer.date,
                    verification: m.timer.verification,
                  },
                };
                
                this.gameService.sendGameEvent(m.game.id, timerStart);
                
                this.gameManager.time(m, m.timer.date, async () => {
                  m.timer = { value: 3, date: m.timer.date, t: null, verification: [], entity: null };
                  const timerStart = {
                    type: AC.TIMER,
                    [AC.TIMER]: {
                      value: m.timer.value - 3,
                      date: m.timer.date,
                      verification: m.timer.verification,
                    },
                  };
                  this.gameService.sendGameEvent(m.game.id, timerStart);
                  
                  if (m.playersMoney[m.turn] < 0) {
                    // если баланс все еще минусовой - запуск процедуры банкротсва
                    // после окончания - проверка на конец игры
                    await this.gameManager.bankrupt(m, m.turn);
                    await this.gameManager.gameCycle(m);
                  } else {
                    await this.gameManager.gameCycle(m);
                  }
                });
                m.timer.entity.tick();
              } else {
                // если в плюсе - продолжить игровой цикл
                await this.gameManager.gameCycle(m);
              }
            });
            m.timer.entity.tick();
            // m.timer.date = Date.now();
            // m.timer.value = 30;
            // timerStart.timer = {
            //   value: m.timer.value - 10,
            //   date: m.timer.date,
            // };
            // await this.gameService.sendGameEvent(m.game.id, timerStart);
            
            // End afterParty phase
            
            // await this.gameManager.gameCycle(m);
          }
          else if (type === AC.PROCESS_CARD) {
            const card = action[type];
            const asset = m.assets[card];
            const cardType = asset.item.additional.lottery ? 'lotteries' : 'chances';
            
            if (card && m.map[cardType][m.map[cardType].length - 1] && (asset.owner === 'game' || asset.owner === from)) {
              await this.processCardAction(m, asset.id, { playerId: from, asset: action.asset, additionalData: action.additionalData });
            } else {
              throw new Error(AC.NO_ACCESS);
            }
          }
          else if (type === AC.OWN_CARD) {
            const card = action[type];
            const asset = m.assets[card];
            
            if (asset.owner === 'game') {
              asset.owner = from;
              
              const gameEvent = {
                type: AC.REACTION,
                reaction: {
                  type: AC.TRANSACTIONS,
                  [AC.TRANSACTIONS]: [
                    {
                      from: 'game',
                      to: from,
                      type: AC.ASSET,
                      asset: asset.id,
                    },
                  ],
                },
              };
              await this.gameService.sendGameEvent(m.game.id, gameEvent);
            } else {
              throw new Error(AC.NO_ACCESS);
            }
          }
          else if (type === AC.JAIL_REDEMPTION) {
            const { money } = action[type];
            if (m.playersInJail[from] !== undefined && money && m.playersMoney[from] >= 200) {
              const buff = m.playersInJail[m.turn];
              delete m.playersInJail[m.turn];
              
              m.playersMoney[from] -= 200;
              
              const transaction = {
                type: AC.REACTION,
                [AC.REACTION]: {
                  type: AC.TRANSACTIONS,
                  [AC.TRANSACTIONS]: [
                    {
                      from,
                      to: 'game',
                      type: AC.MONEY,
                      money: 200,
                    },
                  ],
                },
              };
              await this.gameService.sendGameEvent(m.game.id, transaction);
              
              const gameEvent = {
                type: AC.REACTION,
                [AC.REACTION]: {
                  type: AC.JAIL_REDEMPTION,
                  player: from,
                  result: true,
                },
              };
              await this.gameService.sendGameEvent(m.game.id, gameEvent);
  
              //UNDO START
              this.gameManager.undoAction(m, async(m: IManager) => {
                m.playersInJail[m.turn] = buff;
  
                m.playersMoney[from] += 200;
  
                const transaction = {
                  type: AC.REACTION,
                  [AC.REACTION]: {
                    type: AC.TRANSACTIONS,
                    [AC.TRANSACTIONS]: [
                      {
                        from: 'game',
                        to: from,
                        type: AC.MONEY,
                        money: 200,
                      },
                    ],
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, transaction);
  
                const gameEvent = {
                  type: AC.REACTION,
                  [AC.REACTION]: {
                    type: AC.JAIL,
                    [AC.JAIL]: from
                  },
                };
                await this.gameService.sendGameEvent(m.game.id, gameEvent);
              });
              //UNDO END
              
              await this.gameManager.gameCycle(m, {cFlag: true});
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
          }
          else if (type === AC.SCRIPT_0) {
            const data = action[type];
            
            if (m.currentScript && m.currentScript.name === type) {
              if (m.currentScript.players.includes(from)) {
                const index = m.currentScript.players.indexOf(from);
                m.currentScript.players.splice(index, 1);
                await this.gameService.setScriptData(`${m.game.id}-${type}`, data);
                
                //next script
                const event = {
                  type: AC.SCRIPT_1,
                  [AC.SCRIPT_1]: data.players,
                };
                m.currentScript = { name: AC.SCRIPT_1, players: data.players };
                await this.gameService.sendGameEvent(m.game.id, event);
                
              } else {
                throw new Error(AC.SOMETHING_WENT_WRONG);
              }
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
          }
          else if (type === AC.SCRIPT_2) {
            const data = action[type];
            
            if (m.currentScript && m.currentScript.name === type) {
              if (m.currentScript.players.includes(from)) {
                const index = m.currentScript.players.indexOf(from);
                m.currentScript.players.splice(index, 1);
                await this.gameService.setScriptData(`${m.game.id}-${type}`, data);
                
                //next script
                const event = {
                  type: AC.SCRIPT_3,
                  [AC.SCRIPT_3]: data.players,
                };
                m.currentScript = { name: AC.SCRIPT_3, players: data.players };
                await this.gameService.sendGameEvent(m.game.id, event);
                
              } else {
                throw new Error(AC.SOMETHING_WENT_WRONG);
              }
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
          }
          else if (type === AC.BET) {
            const {guess, cardId} = action[type];
            const card = m.assets[cardId];
            const {bet, one, two} = card.item.additional;
            const dices = (await this.gameManager.rollDiceOperation(m, true)).sort();
            let guessed = 0;

            guess.sort().forEach((g, index) => {
              if(g === dices[index]){
                guessed++;
              }
            });

            if(guessed === 0){
              const money = Number(bet);
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
                  money,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, gameEvent);
        } else if (guessed > 0){
          const money = guessed === 1 ? Number(one) : Number(two);
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
                  money,
                },
              ],
            },
          };
          await this.gameService.sendGameEvent(m.game.id, gameEvent);
        }
          }
        } else {
          throw new Error(AC.NO_ACCESS);
        }
      }
      else if (m.subPhase === AC.PARTY) {
        if (type === AC.OFFER) {
          const offer = action[type];
          
          if (offer.from.playerId === from &&  // if offer creator is "from"
            m.game.players[offer.from.playerId] && m.game.players[offer.to.playerId]) { // if offer participants is game players
            
            if (m.offersLimits[from] > 0) { // if "from" participant has permission to make offer
              
              // generate offer id
              offer.id = uuid.v4();
              
              await this.gameService.sendGameEvent(m.game.id, action, offer.to.playerId);
              
              m.offersLimits[from]--;
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
          } else {
            throw new Error(AC.SOMETHING_WENT_WRONG);
          }
        }
        else if (type === AC.ACCEPTION) {
          const acception = action[type];
          
          if (acception.type === AC.OFFER) {
            const offer = acception[acception.type];
            
            if (offer.to.playerId === from && // if offer accepted by "to"
              m.game.players[offer.from.playerId] && m.game.players[offer.to.playerId]) {
              
              const processOfferPart = (part, toPlayerId) => {
                const { playerId, money, assets } = part;
                
                if (money && m.playersMoney[playerId] - money < 0) {
                  throw new Error(AC.SOMETHING_WENT_WRONG);
                }
                
                m.playersMoney[playerId] -= money;
                m.playersMoney[toPlayerId] += money;
                
                assets.forEach(aId => {
                  const asset = m.assets[aId];
                  if (asset.owner === playerId) {
                    asset.owner = toPlayerId;
                  } else {
                    throw new Error(AC.SOMETHING_WENT_WRONG);
                  }
                });
              };
              
              processOfferPart(offer.from, offer.to.playerId);
              processOfferPart(offer.to, offer.from.playerId);
              
              // send successful accept to sender
              const acception = {
                type: AC.ACCEPTION,
                [AC.ACCEPTION]: {
                  type: AC.OFFER,
                  [AC.OFFER]: offer,
                },
              };
              await this.gameService.sendGameEvent(m.game.id, acception, from);
              
              // send offer to all players
              const reaction = {
                type: AC.REACTION,
                [AC.REACTION]: {
                  type: AC.OFFER,
                  [AC.OFFER]: offer,
                },
              };
              await this.gameService.sendGameEvent(m.game.id, reaction);
              
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
            
          }
        }
        else if (type === AC.REJECTION) {
          
          await this.gameService.sendGameEvent(m.game.id, action);
        }
      }
      else if (m.subPhase === AC.AFTER_PARTY) {
        if (type === AC.OFFER) {
          const offer = action[type];
          
          if (offer.from.playerId === from &&  // if offer creator is "from"
            m.game.players[offer.from.playerId] && m.game.players[offer.to.playerId]) { // if offer participants is game players
            
            if (m.offersLimits[from] > 0) { // if "from" participant has permission to make offer
              
              // generate offer id
              offer.id = uuid.v4();
              
              await this.gameService.sendGameEvent(m.game.id, action, offer.to.playerId);
              
              m.offersLimits[from]--;
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
          } else {
            throw new Error(AC.SOMETHING_WENT_WRONG);
          }
        }
        else if (type === AC.ACCEPTION) {
          const acception = action[type];
          
          if (acception.type === AC.OFFER) {
            const offer = acception[acception.type];
            
            if (offer.to.playerId === from && // if offer accepted by "to"
              m.game.players[offer.from.playerId] && m.game.players[offer.to.playerId]) {
              
              const processOfferPart = (part, toPlayerId) => {
                const { playerId, money, assets } = part;
                
                if (money && m.playersMoney[playerId] - money < 0) {
                  throw new Error(AC.SOMETHING_WENT_WRONG);
                }
                
                m.playersMoney[playerId] -= money;
                m.playersMoney[toPlayerId] += money;
                
                assets.forEach(aId => {
                  const asset = m.assets[aId];
                  if (asset.owner === playerId) {
                    asset.owner = toPlayerId;
                  } else {
                    throw new Error(AC.SOMETHING_WENT_WRONG);
                  }
                });
              };
              
              processOfferPart(offer.from, offer.to.playerId);
              processOfferPart(offer.to, offer.from.playerId);
              
              // send successful accept to sender
              const acception = {
                type: AC.ACCEPTION,
                [AC.ACCEPTION]: {
                  type: AC.OFFER,
                  [AC.OFFER]: offer,
                },
              };
              await this.gameService.sendGameEvent(m.game.id, acception, from);
              
              // send offer to all players
              const reaction = {
                type: AC.REACTION,
                [AC.REACTION]: {
                  type: AC.OFFER,
                  [AC.OFFER]: offer,
                },
              };
              await this.gameService.sendGameEvent(m.game.id, reaction);
              
            } else {
              throw new Error(AC.SOMETHING_WENT_WRONG);
            }
            
          }
        }
        else if (type === AC.REJECTION) {
          
          await this.gameService.sendGameEvent(m.game.id, action);
        }
        
        else if (m.turn === from) {
          
          if (type === AC.REQUEST) {
            const { type, asset, value } = action.request;
            
            const asset_object = m.assets[asset] as IXAsset;
            const assetCost = asset_object.item.cost;
            
            if (asset && !asset_object) { // if not exist
              throw new Error(AC.ASSET_NO_EXIST);
            }
            
            if (type === AC.MORTGAGE) {
              if (asset_object.owner === from) {  // if owner is "from"
                if (!asset_object.isMortgaged && asset_object.lvl === 0) { // if asset not already mortgaged
                  /** Perform action*/
                  asset_object.isMortgaged = true;
                  const money = Number(asset_object.item.additional.mortgage);
                  m.playersMoney[from] += Number(money);
                  
                  
                  const gameEvent = {
                    type: AC.REACTION,
                    [AC.REACTION]: {
                      type: AC.TRANSACTIONS,
                      [AC.TRANSACTIONS]: [
                        {
                          from: 'game',
                          to: from,
                          type: AC.MONEY,
                          money,
                        },
                        {
                          from,
                          to: 'game',
                          type: AC.MORTGAGE,
                          asset,
                        },
                      ],
                    },
                  };
                  await this.gameService.sendGameEvent(m.game.id, gameEvent);
                } else {
                  throw new Error(AC.SOMETHING_WENT_WRONG);
                }
              } else {
                throw new Error(AC.NO_ACCESS);
              }
            }
            else if (type === AC.DOWNGRADE) {
              if (asset_object.owner === from) { // if u are the owner
                if (asset_object.item.canBeUpgraded) {
                  const monopoly = m.itemGroupsAssets[asset_object.item.additional.group];
                  if (monopoly
                    && monopoly.every(aId => m.assets[aId].owner === from)) { // if u have a monopoly
                    const lvl = asset_object.lvl - 1;
                    if (lvl >= 0 && !monopoly.some(aId => Math.abs(m.assets[aId].lvl - lvl) > 1)) { // if all cells has the same lvl
                      const money = Math.floor(Number(asset_object.item.additional.upcost) * 0.9);
                      /** Perform action*/
                      
                      if (m.assets[asset].lvl === 5) {
                        m.hotelCount++;
                        
                        const hotelCountEvent = {
                          type: AC.REACTION,
                          [AC.REACTION]: {
                            type: AC.HOTEL_COUNT,
                            [AC.HOTEL_COUNT]: m.hotelCount,
                          },
                        };
                        await this.gameService.sendGameEvent(m.game.id, hotelCountEvent);
                      } else {
                        m.houseCount++;
                        
                        const houseCountEvent = {
                          type: AC.REACTION,
                          [AC.REACTION]: {
                            type: AC.HOUSE_COUNT,
                            [AC.HOUSE_COUNT]: m.houseCount,
                          },
                        };
                        await this.gameService.sendGameEvent(m.game.id, houseCountEvent);
                      }
                      
                      m.assets[asset].lvl--;
                      m.playersMoney[from] += money;
                      
                      const gameEvent = {
                        type: AC.REACTION,
                        reaction: {
                          type: AC.TRANSACTIONS,
                          [AC.TRANSACTIONS]: [
                            {
                              from: 'game',
                              to: from,
                              type: AC.DOWNGRADE,
                              asset,
                              lvl: asset_object.lvl,
                            },
                            {
                              from: 'game',
                              to: from,
                              type: AC.MONEY,
                              money,
                            },
                          ],
                        },
                      };
                      await this.gameService.sendGameEvent(m.game.id, gameEvent);
                      
                      // remove from upgrade counter
                      const index = m.assetUpgraded.indexOf(asset.id);
                      if (index !== -1) {
                        m.assetUpgraded.splice(index, 1);
                      }
                      
                    } else {
                      throw new Error(AC.SOMETHING_WENT_WRONG);
                    }
                  } else {
                    throw new Error(AC.SOMETHING_WENT_WRONG);
                  }
                } else {
                  throw new Error(AC.SOMETHING_WENT_WRONG);
                }
              } else {
                throw new Error(AC.NO_ACCESS);
              }
            }
          }
        } else {
          throw new Error(AC.NO_ACCESS);
        }
      }
      else {
        throw new Error(AC.SOMETHING_WENT_WRONG);
      }
    } catch (e) {
      // console.log(e);
      const rejection = {
        type: AC.REJECTION,
        [AC.REJECTION]: {
          type: AC.ACTION,
          [AC.ACTION]: action,
          msg: e.message,
        },
      };
      await this.gameService.sendGameEvent(m.game.id, rejection, from);
      return Promise.reject(e);
    }
  }
}

