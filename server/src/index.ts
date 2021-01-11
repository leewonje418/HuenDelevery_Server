import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import api from "./api";
import logger from "./lib/logger/console"
import * as path from "path"
import * as dotenv from "dotenv"

dotenv.config({ path: path.join(__dirname, "../.env") });

const { PORT } = process.env;

createConnection()
  .then(async connection => {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use("/", api)
    app.listen(PORT || 3000, () => {
      logger.green(`Server started on port ${PORT}!`);
    });
  })
  .catch(error => logger.red(error));