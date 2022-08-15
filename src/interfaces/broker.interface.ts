import {IBase} from './base.interface';

export enum BrokerTypeEnum {
    ByBitFutures = 'ByBitFutures'
}

export type BrokerLog = {
    pairId: string,
    lastUpdated: number
}

export interface IBroker extends IBase{
    title: string;
    api_key: string;
    secret_key: string;
    authorId: string;
    isSyncing: boolean;
}
