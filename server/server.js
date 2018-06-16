/* eslint-disable no-console */

import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import hbs from 'hbs';
import hbsUtilities from 'hbs-utils';
import path from 'path';

import connect from './db';
import './passport';
import genSocketEvents from './socketEvent';
import globalMiddleware from './middleware';
import routes from './routes';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
connect().catch(err => console.error('Could not connect to DB', err.message));

hbs.localsAsTemplateData(app);
hbs.registerHelper('toJSON', obj => JSON.stringify(obj, null, 2));
const hbsUtils = hbsUtilities(hbs);
let hbsRegisterPartials = hbsUtils.registerPartials.bind(hbsUtils);
let hbsRegisterPartialsOpt = {};
if (process.env.NODE_ENV === 'development') {
  hbsRegisterPartials = hbsUtils.registerWatchedPartials.bind(hbsUtils);
  hbsRegisterPartialsOpt = {
    onchange(template) { console.log(`hbs partial [${template}] added/changed`); },
  };
}
hbsRegisterPartials(path.join(__dirname, '../views/partials'), hbsRegisterPartialsOpt);
app.set('view engine', 'hbs');

app.use(globalMiddleware);

io.on('connection', (socket) => {
  console.log('New user connected');
  genSocketEvents(socket, io);
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
