/**
 * Internal msg events
 *
 * strict|....
 * server|....
 *
 * Game phases:
 *  - new - игра создана и есть в памяти
 *  - setup - хост зашел в лобби и готов принимать новых игроков
 *  - init - все подтвердили готовность начать игру
 *  - start - клиент загрузил все ресурсы игры
 *  - main -  все подготовительные моементы прошли
 *  - end - ту би континю
 *
 * Game new:
 *  - establish socket connection
 *  - client settings screen
 *  - finish socket preparation
 *  - client setting up
 *  - other client ask permission to connect
 *  - everybody ready for start
 *  - settings send to init game
 *  - waiting for their turn
 *
 *
 *  Game setup:
 *  - server received settings end places into queue
 *  - server checking queue
 *  - server sending status to begin
 *  - server received status to begin
 *  - server sending status with initiation
 *
 *
 *  Game start:
 *  - client received status with initiation
 *  - client starting game scene
 *  - sending server status with ready game scene
 *  - when everybody are ready server randomizes colors and logos and send info to all when ready
 *  - clients receiving info and get ready for game start
 *  - when everybody is ready server sending to all that game started
 *  - client received status that game started
 *
 *
 *  - Game settings got
 *  - Create game
 *  - Setup game
 *  - Sync phase
 *    - client is ready for the next phase
 *  - Player sequence phase
 *  - Start
 *  - Main
 *    - player move
 *      - generate move
 *      - players received move
 *      - player moves
 *      - action
 *      - player decision
 *    - other transaction phase
 *      - player created transaction
 *      - send to other player
 *      - accept/decline transaction
 *      - other players aware of transaction
 *    - previous actions finished if they should
 *
 * */
import { ISPlayers, IGame } from '../interfaces/game.interface';
import { IGameSettings } from '../interfaces/gameSettings.interface';

export class Game implements Omit<IGame, 'isDeleted' | 'createdAt' | 'updatedAt'>{
  id: string;
  name: string;
  isPrivate: boolean;
  password: string;
  phase: string;
  subphase: string;
  service: string;
  players: ISPlayers;
  settings: IGameSettings;
  
  constructor(){
  
  }
}

/**
 * Map
 *
 * New Round 0  ---
 * Homemade food 1
 * Lottery 2
 * Shawarma stall 3
 * Incoming Tax 4
 * Taxi depot 5 -
 * Delivery service 6
 * Cafe 7
 * Event 8  ----------
 * Retail market 9
 * Jail 10  ---
 * Book publishing house 11
 * Comics publishing house 12
 * Electricity company 13
 * Mass media company 14
 * Track company 15 -
 * Store company 16
 * Building company 17
 * Lottery 18
 * Agriculture company 19
 * Vacation 20 ---
 * IT company 21
 * Event 22
 * Internet service provider 23
 * Communication company 24
 * Train company 25 -
 * Phone making company 26
 * Computer making company 27
 * Water company 28
 * High tech company 29
 * Jail 30  ---
 * Coal company 31
 * Petrol and Gas company 32
 * Lottery 33
 * Oil company 34
 * Sea transport company 35 -
 * Event 36
   * Invest found 37
 * Patent infringement 38
 * Space company 39
 * 0
 *
 *
 *
 * */

// Redis DATA
// {gameId}-lobby-connection-status
// current_${userId}
// players_${gameId}
// game_${gameId}
// games_${userId}