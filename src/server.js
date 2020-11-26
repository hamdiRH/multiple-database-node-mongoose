import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import morgan from './utils/morgan';
import clientListener from './middlewares/clientListener';
import setclientdb from './middlewares/setclientdb';
import modelsInit from './middlewares/modelsInit';
import routes from './routes';
import { notFound, errorHandler } from './middlewares/errorhandler'

const app = express();

//** HTTP request logger middleware
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

//** set security HTTP headers
app.use(helmet());

app.use(session({ resave: true, secret: '123456', saveUninitialized: true }));
global.App = {
  clients: [],
  activdb: '',
  clientdbconn: [],
  clientModel: [],
};
app.use(clientListener()); //** checks and identify valid clients
app.use(setclientdb()); //** sets db for valid clients
app.use(modelsInit()); //** initilize models

//** parse json request body
app.use(express.json());

//** parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//** sanitize request data
app.use(xss());
app.use(mongoSanitize());

//** gzip compression
app.use(compression());

//** enable cors
app.use(cors());
app.options('*', cors());

//** routes
app.use('/api', routes);
app.use('/load-session', (req, res) => res.send());
app.use(notFound)
app.use(errorHandler)



export default app;
