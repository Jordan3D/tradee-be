import { BaseEntity, ItemGroupEntity } from '../../../model/index';
import { IsString } from 'class-validator';

export class CreateRequestDto implements Omit<ItemGroupEntity, keyof BaseEntity>{
  @IsString()
  color: string;
  @IsString()
  name: string;
}