import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../constants';

export const InjectRedis = () => Inject(REDIS_CLIENT);
