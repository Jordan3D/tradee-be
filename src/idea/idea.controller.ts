import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
  Req,
  Query,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';


const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { CreateBody, UpdateBody } from './dto/requests';
import { ResponseDto } from './dto/responses';
import { IdeaService } from './idea.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { INote } from 'src/interfaces/note.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from 'src/interfaces/file.interface';
import { FileService } from 'src/file/file.service';
import { IIdeaFull, IIdeaOverall } from 'src/interfaces/idea.interface';

@Controller('/idea')
export class IdeaController {

  private readonly logger = new Logger(IdeaController.name);
  constructor(
    private readonly rootService: IdeaService,
    private readonly fileService: FileService
  ) { }

  @Post('/create')
  async create(
    @Body() data: CreateBody,
    @Req() request: Request
  ): Promise<ResponseDto> {
    let createdEntity;
    
    try {
      const createData = { ...data, authorId: '' };
      const token = getToken(request);
      const payload = jwt.verify(token, config.jwtSecret);

      createData.authorId = payload.userId;

      createdEntity = await this.rootService.create(createData);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return new ResponseDto(createdEntity);
  }

  // for input search
  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async findBy(@Req() request: Request, @Query() query : {text?: string, limit?: number, offset?: number, lastId?: string}):Promise<IIdeaOverall[]> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    return this.rootService.findBy({...query, authorId: payload.userId})
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Idea not found');
    }

    return new ResponseDto(entity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadFile(@Req() request: Request, @UploadedFile() photo: Express.Multer.File): Promise<IFile> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    try {
      const file = await this.rootService.uploadPhoto({file: photo.buffer, name: photo.originalname, authorId: payload.userId});

      console.dir(file);
      
      return file;
    }catch(error){
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/photo/:id')
  async deletePhoto(@Param('id') id: string, @Req() request: Request): Promise<boolean> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.fileService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Photo not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to delete');
    }

    return this.rootService.deletePhoto(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateBody, @Req() request: Request): Promise<ResponseDto> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Note not found');
    }

    // TODO: check owner by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to change');
    }

    let updatedEntity;

    try {
      updatedEntity = await this.rootService.update(id, data);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return new ResponseDto(updatedEntity);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: Request): Promise<boolean> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const entity = await this.rootService.getById(id);
    if (entity === undefined) {
      throw new NotFoundException('Note not found');
    }

    // TODO: check author by jwt
    if (payload.userId !== entity.authorId) {
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.rootService.delete(id)
  }
}
