/* eslint-disable no-console */

import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import { promisify } from 'es6-promisify';

import connect from './db';
import './passport';
import './mailer';
import genSocketEvents from './socketEvent';
import globalMiddleware from './middleware';
import routes from './routes';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
connect().catch(err => console.error('Could not connect to DB', err.message));

app.set('view engine', 'pug');

/* without this, express incorrectly gets wrong header info because it thinks requests are coming
   from nginx so for eg. req.protocol would be 'http' when it should be 'https' */
app.set('trust proxy', true);

app.use(globalMiddleware);

io.on('connection', (socket) => {
  console.log('New user connected');
  genSocketEvents(socket, io);
});

// convert callback based methods to use promises
app.use((req, res, next) => {
  req.login = promisify(req.login.bind(req));
  next();
});

// pass variables to all templates
app.use((req, res, next) => {
  const flashes = req.flash();
  res.locals.user = req.user;
  res.locals.flashes = Object.keys(flashes).length > 0 ? flashes : undefined;
  next();
});
app.use('/', routes);

export { server as default, io };
