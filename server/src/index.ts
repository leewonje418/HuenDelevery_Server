import * as http from "http";
import app from "./app";
import * as database from "./orm";
import * as path from "path"
import * as dotenv from "dotenv"
import logger from "./lib/logger/console";

dotenv.config({ path: path.join(__dirname, "../.env") })

const { PORT } = process.env;

database.getConnection();

http.createServer(app).listen(PORT || 8080, () => {
  logger.green(`Server is listening to ${PORT}`);
});