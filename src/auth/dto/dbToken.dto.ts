import { BaseEntity, TokenEntity } from '../../model';
import { Exclude, Expose } from 'class-transformer';

/** token that was returned from db and contains sensitive information */
@Exclude()
export class DbTokenDto extends BaseEntity {
  constructor(partial: Partial<TokenEntity>) {
    super();
    Object.assign(this, partial);
  }
}
