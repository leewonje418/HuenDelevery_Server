import * as express from 'express';
import * as cors from "cors";
import api from './controller'
import * as bodyParser from 'body-parser';
import * as path from 'path';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", api);
export default app;