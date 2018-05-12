/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';

import isRealString from './utils/validation';
import Users from './utils/users';
import { generateMessage, generateLocationMessage } from './utils/message';

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.set('view engine', 'html');
app.engine('html', require('hbs').__express); // eslint-disable-line no-underscore-dangle


io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required!');
    }

    const name = params.name.trim();
    const room = params.room.trim().toLowerCase();
    const user = users.getUser({ name });

    if (user && user.room === room) {
      return callback('Username taken!');
    }

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    io.to(room).emit('updateUserList', users.getUserList(room));
    socket.emit('newMessage', generateMessage('Admin', `Welcome to the room ${room}!`));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} joined the chat`));
    return callback();
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser({ id: socket.id });

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser({ id: socket.id });

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
  });
});

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', 'public');
app.get('/', (req, res) => {
  const rooms = users.getRoomList();
  res.render('join', { rooms, roomCount: rooms.length });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
