/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import mongoose from 'mongoose';
import Users from './utils/users';
import globalMiddleware from './middleware';
import connect from './db';
import genSocketEvents from './socketEvent';
import './models/User';

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
connect().catch(err => console.error('Could not connect to DB', err.message));
const User = mongoose.model('User');
const users = Users.getInstance();


app.set('view engine', 'html');
app.engine('html', require('hbs').__express); // eslint-disable-line no-underscore-dangle

app.use(globalMiddleware);

io.on('connection', (socket) => {
  console.log('New user connected');
  genSocketEvents(socket, io);
});

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', 'public');

app.post('/user', async (req, res) => {
  const newUser = new User(req.body);
  try {
    const user = await newUser.save();
    console.log('created new user', user);
    res.send('created new user');
  } catch (err) {
    console.error('oh no', err);
    res.send(err.message);
  }
});

app.get('/', (req, res) => {
  const rooms = users.getRoomList();
  res.render('join', { rooms, roomCount: rooms.length });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
