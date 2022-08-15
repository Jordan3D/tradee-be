import {
    IsString
  } from 'class-validator';
  
  export class SyncBody {  
    @IsString()
    broker: string;
  }
  