import {
  Connection,
  createConnection,
  ConnectionOptions,
} from 'typeorm';
import logger from './lib/logger';
import entities from './entity';

export const getConnection = async (): Promise<Connection> => {

  const connectionOptions: ConnectionOptions = {
    type: 'mysql',
    database: databaseConfig.database,
    synchronize: databaseConfig.synchronize,
    logging: databaseConfig.logging,
    entities,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    charset: databaseConfig.charset,
  };

  try {
    const connection = createConnection(connectionOptions);
    logger.success('[DB] connected');
    return connection;
  } catch (err) {
    logger.error('[DB] Connection Error', err.message);
  }
};