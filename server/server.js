/* eslint-disable no-console */

import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import globalMiddleware from './middleware';
import connect from './db';
import genSocketEvents from './socketEvent';
import './models/User';
import routes from './api';

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
connect().catch(err => console.error('Could not connect to DB', err.message));

app.set('view engine', 'html');
app.engine('html', require('hbs').__express); // eslint-disable-line no-underscore-dangle

app.use(globalMiddleware);

io.on('connection', (socket) => {
  console.log('New user connected');
  genSocketEvents(socket, io);
});

app.set('views', 'public');

app.use('/', routes);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
