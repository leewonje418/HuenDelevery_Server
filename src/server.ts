import 'dotenv/config';
import * as http from 'http';
import socket from 'socket.io';
import app from './app';
import * as database from './orm';
import logger from './lib/logger';
import { PORT } from '../config/config';
import { runSocket } from './socket';

database.getConnection();

const server = http.createServer(app);
const io = socket(server);

runSocket(io);

server.listen(PORT, () => {
  logger.success(`Server is listening to ${PORT}`);
});