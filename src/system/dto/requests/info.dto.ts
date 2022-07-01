import { IsBoolean, IsOptional } from 'class-validator';

export class InfoDto {
  @IsOptional()
  @IsBoolean()
  all: boolean;
  
  @IsOptional()
  @IsBoolean()
  playersOnline: boolean;
  
  @IsOptional()
  @IsBoolean()
  playersOnlineCount: boolean;
  
  @IsOptional()
  @IsBoolean()
  gameManagersCount: boolean;
  
  @IsOptional()
  @IsBoolean()
  gamesDynamicCount: boolean;
}
