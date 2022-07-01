import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { FileEntity } from '../model';
import config from '../config/index';

/** user service */
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity) private readonly fileRepo:  Repository<FileEntity>
  ) {
  
  }
  
  async getById(id: string): Promise<FileEntity>{
    return await this.fileRepo.findOne(id);
  };
  
  async uploadPublicFile(file: Buffer, key: string): Promise<FileEntity>{
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: config.aws.bucket,
      Body: file,
      Key: key
    }).promise();
  
    const newFile = this.fileRepo.create({
      key: uploadResult.Key,
      url: uploadResult.Location
    });
    await this.fileRepo.save(newFile);
    
    return newFile;
  }
  
  async deletePublicFile(fileId: string): Promise<void> {
    const file = await this.fileRepo.findOne(fileId);
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: config.aws.bucket,
      Key: file.key,
    }).promise();
    await this.fileRepo.delete(fileId);
  }
}
