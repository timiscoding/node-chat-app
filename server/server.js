/* eslint-disable no-console */

import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

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

app.set('view engine', 'hbs');
app.use(globalMiddleware);

io.on('connection', (socket) => {
  console.log('New user connected');
  genSocketEvents(socket, io);
});

app.use('/', routes);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
