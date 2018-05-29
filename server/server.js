/* eslint-disable no-console */

import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import hbs from 'hbs';
import path from 'path';

import connect from './db';
import './models';
import './passport';
import genSocketEvents from './socketEvent';
import globalMiddleware from './middleware';
import routes from './routes';

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
connect().catch(err => console.error('Could not connect to DB', err.message));

hbs.localsAsTemplateData(app);
hbs.registerPartials(path.join(__dirname, '../../views/partials'));
hbs.registerHelper('toJSON', obj => JSON.stringify(obj, null, 2));
app.set('view engine', 'hbs');

app.use(globalMiddleware);

io.on('connection', (socket) => {
  console.log('New user connected');
  genSocketEvents(socket, io);
});

// pass variables to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.flashes = req.flash();
  next();
});
app.use('/', routes);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
