import {
  Connection,
  createConnection,
  ConnectionOptions,
} from 'typeorm';
import logger from './lib/logger';
import entities from './entity';
import { MYSQL } from '../config/config';

export const getConnection = async (): Promise<Connection> => {

  const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    database: MYSQL.DATABASE,
    synchronize: MYSQL.SYNC,
    logging: false,
    host: MYSQL.HOST,
    port: MYSQL.PORT,
    username: MYSQL.USERNAME,
    password: MYSQL.PASSWORD,
    charset: 'utf8',
    entities,
  };

  try {
    const connection = createConnection(connectionOptions);
    logger.success('[DB] connected');
    return connection;
  } catch (err) {
    logger.error('[DB] Connection Error', err.message);
    throw err;
  }
};