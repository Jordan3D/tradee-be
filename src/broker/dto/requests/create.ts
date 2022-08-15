import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray
} from 'class-validator';
import { BrokerTypeEnum } from 'src/interfaces/broker.interface';

export class CreateBody {  
  @IsString()
  title: string;

  @IsString()
  api_key: string;

  @IsString()
  secret_key: string;

  @IsString()
  broker_type: BrokerTypeEnum;
}
