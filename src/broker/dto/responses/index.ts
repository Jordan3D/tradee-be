import { Exclude } from 'class-transformer';
import { IBroker } from 'src/interfaces/broker.interface';

export class ResponseBroker implements IBroker{
  id: string;
  title: string;
  authorId: string;
  isSyncing: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSync: string;
  isRemoved: boolean;

  @Exclude()
  api_key: string;
  @Exclude()
  secret_key: string;

  constructor(partial: Partial<IBroker>){
    Object.assign(this, partial)
  }
}