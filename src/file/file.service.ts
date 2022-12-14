import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { FileEntity } from './file.entity';
import config from '../config/index';
import { InjectModel } from '@nestjs/sequelize';
import { IFile } from 'src/interfaces/file.interface';
import { Op, QueryTypes } from 'sequelize';

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
    try {
      const result = await this.rootModel.findAll({
        where: {id: {
          [Op.in]: ids,
        },},
        raw: true
      });
      return result;
    } catch (e){
      return e
    }
  }

  async findBy(
    {text, authorId, limit, lastId}: 
    Readonly<{text?: string, authorId: string, limit?: number, lastId?: string}>
    ): Promise<IFile[]> {
      let lastItem;
      if(lastId){
        lastItem = await this.rootModel.findOne({where: {id: lastId}, raw: true});
      }

      return await this.rootModel.sequelize.query(
        `SELECT *  FROM "File" file
        WHERE "authorId"='${authorId}' 
        ${text ? `AND LOWER("key") LIKE LOWER('%${text}%')` : ''}
        ${lastItem ? `AND file."createdAt" < '${new Date(lastItem.createdAt).toISOString()}'` : ''}
        ORDER BY "createdAt" DESC
        ${limit ? `LIMIT ${limit}` : ''}`,
         { type: QueryTypes.SELECT }
        );
  }

  async keyCheckIfExist({authorId, key}: {key: string, authorId: string}): Promise<boolean> {
    return !!(await this.rootModel.findOne({where: {authorId, key}, raw: true}));
  };
  
  async uploadPublicFile({file, key, authorId}: {file: Buffer, key: string, authorId: string}): Promise<FileEntity>{
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
