import { Exclude } from 'class-transformer';
import { IBroker } from 'src/interfaces/broker.interface';
import { ITrade } from 'src/interfaces/trade.interface';

export class ResponseDto implements Omit<IBroker, 'api_key' | 'secret_key' | 'lastSync'> {
  
  id: string;

  title: string;

  authorId: string;
  
  createdAt: Date;
  
  updatedAt: Date;
  
  isSyncing: boolean;

  constructor(entity: IBroker) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}

export class ResponseBroker implements IBroker{
  id: string;
  title: string;
  authorId: string;
  isSyncing: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSync: string;

  @Exclude()
  api_key: string;
  @Exclude()
  secret_key: string;

  constructor(partial: Partial<IBroker>){
    Object.assign(this, partial)
  }
}