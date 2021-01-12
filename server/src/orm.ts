import {
    Connection,
    createConnection,
    ConnectionOptions,
  } from "typeorm";
  import logger from "../src/lib/logger/console";
  import databaseConfig from "../config/ormconfig";
  import entities from "./entity";
  
  export const getConnection = async (): Promise<Connection> => {
  
    const connectionOptions: ConnectionOptions = {
      type: "mysql",
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
      logger.green("[DB] connected");
      return connection;
    } catch (err) {
      logger.red("[DB] Connection Error", err.message);
    }
  };