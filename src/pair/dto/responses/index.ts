import { IPair } from 'src/interfaces/pair.interface';

export class ResponseDto implements IPair {
  
  id: string;

  title: string;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: IPair) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}