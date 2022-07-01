import * as _ from 'lodash';
import { config } from 'dotenv';
/**
 * depending on
 * @param {string} NODE_ENV - evironment
 * exports config
 */

config();

const environment = process.env.NODE_ENV || 'development';
export default _.extend(
  {
    environment,
  },
  // tslint:disable-next-line: no-var-requires
  require(`${__dirname}/env/${environment}`),
);
