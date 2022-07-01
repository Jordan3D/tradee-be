import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateRequestDto, UpdateRequestDto } from './dto/requests';
import { CreateResponseDto, ItemResponseDto, UpdateResponseDto } from './dto/responses';
import { GameMapService } from './gameMap.service';

/**
 * users controller
 */
@Controller('/game-map')
export class GameMapController {
  /** logger */
  private readonly logger = new Logger(GameMapController.name);

  constructor(private readonly gameMapService: GameMapService) {}
  
  @UseGuards(AuthGuard('user_jwt'))
  @Post('/create')
  async createItem(
    @Body() data: CreateRequestDto,
  ): Promise<CreateResponseDto> {
    const created = await this.gameMapService.create(data);
    this.logger.log(`Creating game map ${data.name}`);
    
    return created;
  }
  
  @Post('/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() data: UpdateRequestDto,
  ): Promise<UpdateResponseDto> {
    const updated = await this.gameMapService.update(id, data);
    this.logger.log(`Updating game map ${data.name}`);
    
    return updated;
  }
  
  
  @UseGuards(AuthGuard('user_jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item = await this.gameMapService.getById(id);
    
    if (item === null) {
      throw new NotFoundException('item not found');
    }

    return new ItemResponseDto(item);
  }
  
  
  @UseGuards(AuthGuard('user_jwt'))
  @Get('/all')
  async findAll(): Promise<ItemResponseDto[]> {
    const items = await this.gameMapService.getAll();
    
    return items.map( item => new ItemResponseDto(item));
  }
}
