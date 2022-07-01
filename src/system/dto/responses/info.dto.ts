export class InfoResponseDto {
  playersOnline?: number;
  playersOnlineCount?: number;
  gameManagersCount?: number;
  gamesDynamicClear?: boolean;
  
  constructor(playersOnline, playersOnlineCount, gameManagersCount, gamesDynamicClear) {
    if(playersOnline){
      this.playersOnline = playersOnline;
    }
    
    if(playersOnlineCount){
      this.playersOnlineCount = playersOnlineCount;
    }
    
    if(gameManagersCount){
      this.gameManagersCount = gameManagersCount;
    }
    
    if(gamesDynamicClear){
      this.gamesDynamicClear = gamesDynamicClear;
    }
  }
}
