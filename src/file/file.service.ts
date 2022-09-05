import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { FileEntity } from './file.entity';
import config from '../config/index';
import { InjectModel } from '@nestjs/sequelize';
import { IFile } from 'src/interfaces/file.interface';
import { Op } from 'sequelize';

/** user service */
@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileEntity) private readonly rootModel: typeof FileEntity,
  ) {
  
  }
  
  async getById(id: string): Promise<FileEntity>{
    return await this.rootModel.findOne({where: {id}, raw: true});
  };

  async getByIds(ids: string[]): Promise<IFile[] | undefined> {
    const result = await this.rootModel.findAll({
      where: {id: {
        [Op.in]: ids,
      },},
      raw: true
    });
    
    return result;
  }

  async getByParentId(parentId: string): Promise<IFile[]> {
    const result = await this.rootModel.findAll({ where: { parentId }, raw: true });

    return result;
  }

  async setParent(id: string, parentId: string, parentType: 'idea'): Promise<boolean> {
    return !!this.rootModel.update({parentId, parentType}, { where: { id } });
  }
  
  async uploadPublicFile(file: Buffer, key: string, authorId: string): Promise<FileEntity>{
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: config.aws.bucket,
      Body: file,
      Key: key
    }).promise();

    const result = (await this.rootModel.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
      authorId
    })).toJSON();
    
    return result;
  }
  
  async deletePublicFile(id: string): Promise<boolean> {
    const file = await this.rootModel.findOne({where: {id}, raw: true});
    const s3 = new S3();
    try{
      await s3.deleteObject({
        Bucket: config.aws.bucket,
        Key: file.key,
      }).promise();
      await this.rootModel.destroy({where: {id}});
      return true;
    }catch(e){
      throw e;
    }
  }
}
