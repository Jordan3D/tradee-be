import { TUserConfig } from 'src/interfaces/user/user.interface';
import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';

@Table({ modelName: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: DataType.STRING})
  username: string;
  
  @Column({ type: DataType.STRING })
  email: string;
  
  @Column({ type: DataType.STRING })
  password: string;

  @Column({ type: DataType.JSONB })
  config: TUserConfig;
}