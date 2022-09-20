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
  Delete,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';

const jwt = require('jsonwebtoken');

import { AuthGuard } from '@nestjs/passport';
import { FileService } from './file.service';
import { Request } from 'express';
import config from '../config';
import { getToken } from '../util';
import { FileInterceptor } from '@nestjs/platform-express';
import { IFile } from 'src/interfaces/file.interface';

@Controller('/file')
export class FileController {

  private readonly logger = new Logger(FileController.name);
  constructor(private readonly rootService: FileService) {}
  
  @Post('/add')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@Req() request: Request, @UploadedFile() image: Express.Multer.File): Promise<IFile> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const authorId = payload.userId;
    const fileName = `${authorId}_file_${image.originalname}`;

    try {
      const file = await this.rootService.uploadPublicFile({file: image.buffer, key: fileName, authorId});
      
      return file;
    }catch(error){
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/list')
  async findBy(@Req() request: Request, @Query() query : {text?: string, limit?: number, offset?: number, lastId?: string}):Promise<IFile[]> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    return this.rootService.findBy({...query, authorId: payload.userId})
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/checkName')
  async checkFileName(@Req() request: Request, @Query() query : {name?: string}):Promise<boolean> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);
    return this.rootService.keyCheckIfExist({key: query.name, authorId: payload.userId});
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() request: Request): Promise<boolean> {
    const token = getToken(request);
    const payload = jwt.verify(token, config.jwtSecret);

    const tag = await this.rootService.getById(id);
    if (tag === undefined) {
      throw new NotFoundException('Tag not found');
    }

    if(payload.userId !== tag.authorId){
      throw new UnauthorizedException('Not allowed to delete');
    }


    return this.rootService.deletePublicFile(id)
  }
}
