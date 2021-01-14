import 'dotenv/config';
import * as http from 'http';
import app from './app';
import * as database from './orm';
import logger from './lib/logger';


const { PORT } = process.env;

database.getConnection();

const server = http.createServer(app);

server.listen(PORT || 8080, () => {
  logger.success(`Server is listening to ${PORT}`);
});