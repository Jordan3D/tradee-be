import { IBase } from './base.interface';
import { IItem } from './item.interface';
import { ITransaction } from './transaction.interface';
import { IXAsset } from './asset.interface';
import { IGameMap, IXGameMap } from './gameMap.interface';
import { IGame } from './game.interface';
import Timeout = NodeJS.Timeout;

export interface IManager{
  id: string
  game: IGame
  map: IXGameMap | undefined,
  playersMoney: {
    [key: string] : number
  },
  playersPosition: {
    [key: string] : number
  }
  playersInJail: {
    [key: string] : number  // key: playerId ; value: number of turns
  },
  playersOnline: {
    [key: string]: boolean
  };
  playersPauses: {
    [key: string]: number
  };
  playersLeavePauses: {
    [key: string]: {t: null | Timeout, value: number, date: number}
  };
  playersSequence: string[],
  currentScript: {name: string, players: any} | null,
  assets: {
    [key: string] : IXAsset
  },
  timer: {
    date: number,
    value: number,
    verification: string[],
    t: Timeout // timeout,
    entity: any,
    pause?: boolean
  } | null;
  subPhase: string | undefined;
  turnCounter: number;
  turn: string | null;
  turnDoubles: number;
  itemGroupsAssets: {
    [key: string] : string[]
  }
  offersLimits: {
    [key: string] : number
  }
  pauseTimer: {
    date: number,
    entity: any,
    playerId
  } | null;
  lastTurn: any[];
  chanceIndex: number
  lotteryIndex: number,
  prevDices: number[],
  houseCount: number;
  hotelCount: number;
  assetUpgraded: string[];
  
  win: string;
  counter: any;
  dicesD: any;
  noRequests: boolean;
  wasSameTurn: boolean;
  
  // makeMove(playerId: string, move: number): Promise<boolean>
  // makeTransaction(transaction: ITransaction): Promise<boolean>
  // createAssets(): Promise<boolean>
  // initMap(): Promise<boolean>
  // getMap(): Promise<IXGameMap>
}