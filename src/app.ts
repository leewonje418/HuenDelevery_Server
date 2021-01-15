import * as express from 'express';
import * as cors from 'cors';
import api from './router'
import * as bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api);

export default app;