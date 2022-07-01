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
import { CreateRequestDto } from './dto/requests';
import { CreateResponseDto, ItemResponseDto } from './dto/responses';
import { ItemService } from './item.service';

/**
 * users controller
 */
@Controller('/items')
export class ItemController {
  /** logger */
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createItem(
    @Body() data: CreateRequestDto,
  ): Promise<CreateResponseDto> {
    // console.log(data);
    
    const created = await this.itemService.create(data);
    this.logger.log(`Creating item ${data.name}`);
    
    return created;
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item = await this.itemService.getById(id);
    
    if (item === null) {
      throw new NotFoundException('item not found');
    }

    return new ItemResponseDto(item);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  async findAll(): Promise<ItemResponseDto[]> {
    const items = await this.itemService.getAll();
    
    return items.map( item => new ItemResponseDto(item));
  }
}
