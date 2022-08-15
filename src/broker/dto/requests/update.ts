import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber
} from 'class-validator';
import { BrokerTypeEnum } from 'src/interfaces/broker.interface';

export class UpdateBody {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  api_key: string;

  @IsString()
  @IsOptional()
  secret_key: string;

  @IsString()
  @IsOptional()
  authorId: string;

  @IsString()
  @IsOptional()
  broker_type: BrokerTypeEnum;
}
