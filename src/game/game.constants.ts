import { GameSettingsDTO } from './dto/response';
import { IUser } from '../interfaces/user';
import { IsNumber } from 'class-validator';

export const bankEmail = 'jordan8xd@gmail.com';

export const defaultBank: Partial<Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>> = {
  name: 'Bank',
  email: bankEmail,
};

export const customCards = ['lottery_4', 'chance_2', 'chance_15', 'chance_16', 'lottery_15'];
export const customCardsOwn = ['chance_15', 'chance_16', 'lottery_15'];

export const defaultGameSettings: GameSettingsDTO = {
  playersCount: 2,
  maxPlayersCount: 6,
  minPlayersCount: 2,
  minCircleMoney: 100,
  maxCircleMoney: 10000,
  minStartMoney: 0,
  maxStartMoney: 10000,
  maxMultiRent: 10,
  minMultiRent: 0.1,
  maxMultiTax: 10,
  minMultiTax: 0.1,
  maxMultiCL: 10,
  minMultiCL: 0.1,
  maxMultiUpcost: 5,
  minMultiUpcost: 0.1,
  maxMultiMortgage: 5,
  minMultiMortgage: 0.1,
  maxMultiProperty: 10,
  minMultiProperty: 0.1,
  gameTypes: {
    fast: {
      multiRent: 2,
      multiTax: 1.5,
      multiCL: 2,
      multiProperty: 0.7,
      multiUpcost: 0.5,
      multiMortgage: 1.2,
      isCustomCards: false,
      isCustomCardsPlayersOwn: false,
      circleMoney: 200,
      startMoney: 1500
    },
    classic: {
      multiRent: 1,
      multiTax: 1,
      multiCL: 1,
      multiProperty: 1,
      multiUpcost: 1,
      multiMortgage: 1,
      isCustomCards: false,
      isCustomCardsPlayersOwn: false,
      circleMoney: 300,
      startMoney: 1500
    },
    long: {
      multiRent: 1.7,
      multiTax: 1.5,
      multiCL: 2.5,
      multiProperty: 1.7,
      multiUpcost: 1.7,
      multiMortgage: 0.70,
      isCustomCards: true,
      isCustomCardsPlayersOwn: true,
      circleMoney: 500,
      startMoney: 1100
    }
  },
  examples: {
    "multiRent": {
      name: "shawarma_stall",
      value: 450
    },
    "multiProperty": {
      name: "shawarma_stall",
      value: 60
    },
    "multiUpcost": {
      name: "shawarma_stall",
      value: 50
    },
    "multiMortgage": {
      name: "shawarma_stall",
      value: 30
    },
    "multiTax": {
      name: "incoming_tax",
      value: 200
    },
    "multiCL": {
      name: "chance_5",
      value: 100
    }
  }
};


export const playerColors = ['#3d49d2', '#89ce17', '#9c1fc5', '#e64c4c', '#dfe205', '#00717d', '#f38a31', '#9efaff'];
export const playerColorsError = '#a2c7f0';

export const gameConsts = {
  gamesLimit: 2,
  maxOfferLimit: 3,
  pauseLimit: 3,
  pauseMaxValue: 30,
  maxLeaveTimer: 60,
};

export const actionConsts = {
  PHASE: 'phase',
  SUB_PHASE: 'subPhase',
  MESSAGE: 'message',
  DICES: 'dices',
  POSITION: 'position',
  OFFER: 'offer',
  REQUEST: 'request',
  REACTION: 'reaction',
  REJECTION: 'rejection',
  ACCEPTION: 'acception',
  ACTION: 'action',
  PLAYERS_TURN: 'playersTurn',
  PARTY: 'party',
  AFTER_PARTY: 'afterParty',
  UPGRADE: 'upgrade',
  DOWNGRADE: 'downgrade',
  MORTGAGE: 'mortgage',
  REDEEM: 'redeem',
  BUY: 'buy',
  TIMER: 'timer',
  END_TURN: 'endTurn',
  TRANSACTIONS: 'transactions',
  ASSET: 'asset',
  MONEY: 'money',
  JAIL: 'jail',
  CHANCE_CARD: 'chanceCard',
  LOTTERY_CARD: 'lotteryCard',
  PROCESS_CARD: 'processCard',
  JAIL_REDEMPTION: 'jailRedemption',
  OWN_CARD: 'ownCard',
  HOUSE_COUNT: 'houseCount',
  HOTEL_COUNT: 'hotelCount',
  VALUE_LIMIT: 'valueCount',
  VERIFY_TIMER: 'verifyTimer',
  PLAYERS_ONLINE: 'playersOnline',
  PLAYER_CONNECTED: 'playerConnected',
  ACTIVATE_LEAVE_TIMER: 'activateLeaveTimer',
  DEACTIVATE_LEAVE_TIMER: 'deactivateLeaveTimer',
  PLAYER_LEAVE_INFO: 'playerLeaveInfo',
  PLAYER_DISCONNECTED: 'playerDisconnected',
  BANKRUPT: 'bankrupt',
  WIN: 'win',
  BANKRUPT_WARNING: 'bankruptWarning',
  BET: 'bet',
  SCRIPT_0: 'script_0',
  SCRIPT_1: 'script_1',
  SCRIPT_2: 'script_2',
  SCRIPT_3: 'script_3',
  PAUSE_TIMER: 'pauseTimer',
  VERIFICATION_UPDATE: 'verificationUpdate',
  PLAYER_EXIT: 'playerExit',
  PAUSE_ENABLE: 'pauseEnable',
  PAUSE_DISABLE: 'pauseDisable',
  PAUSE_INFO: 'pauseInfo',
  ASSET_NO_EXIST: 'Asset doesn\'t exist',
  NO_ACCESS: 'No access to perform action',
  NOT_ENOUGH_MONEY: 'Not enough money to perform action',
  SOMETHING_WENT_WRONG: 'Something went wrong',
};