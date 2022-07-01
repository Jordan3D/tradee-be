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
import { CreateRequestDto } from './dto/requests/index';
import { CreateResponseDto, ItemResponseDto } from './dto/responses/index';
import { ItemGroupService } from './itemGroup.service';

/**
 * users controller
 */
@Controller('/item_group')
export class ItemGroupController {
  /** logger */
  private readonly logger = new Logger(ItemGroupController.name);

  constructor(private readonly itemGroupService: ItemGroupService) {}
  
  @UseGuards(AuthGuard('admin_jwt'))
  @Post('/create')
  async createItemGroup(
    @Body() data: CreateRequestDto,
  ): Promise<CreateResponseDto> {
    
    const created = await this.itemGroupService.create(data);
    this.logger.log(`Creating item group with color ${data.color}`);
    
    return created;
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item = await this.itemGroupService.getById(id);
    
    if (item === null) {
      throw new NotFoundException('item group not found');
    }

    return new ItemResponseDto(item);
  }
}

