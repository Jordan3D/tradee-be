import { IsOptional, IsString, IsUUID } from 'class-validator';

export class createUpdate {
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  dateStart: Date;
  
  @IsOptional()
  @IsString()
  dateEnd: Date;
  
  @IsString()
  version: string;
  
  @IsString()
  descriptions: string;
}

export class setUpdate {
  @IsUUID()
  id: string;
}
