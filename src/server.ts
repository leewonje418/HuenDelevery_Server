import 'dotenv/config';
import * as http from 'http';
import app from './app';
import * as database from './orm';
import logger from './lib/logger';
import { PORT } from '../config/config';

database.getConnection();

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.success(`Server is listening to ${PORT}`);
});