import {IBase} from './base.interface';
import { IPair } from './pair.interface';

export enum BrokerTypeEnum {
    ByBitFutures = 'ByBitFutures'
}

export type BrokerLog = {
    pairId: string,
    lastUpdated: number
}

export type TLastSync = {
    pnl: Record<'string', number>,
    tradeTransactions: Record<'string', number>
}
export interface IBroker extends IBase{
    title: string;
    api_key: string;
    secret_key: string;
    authorId: string;
    isSyncing: boolean;
    lastSync: string;
    isRemoved: boolean;
}
