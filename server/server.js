const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

const {generateMessage, generateLocationMessage} = require('./utils/message');

io.on('connection', socket => {
  console.log('New user connected');


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required!');
    }

    const name = params.name.trim();
    const room = params.room.trim().toLowerCase();

    var user = users.getUser({ name })
    if (user && user.room === room) {
      return callback('Username taken!');
    }

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    io.to(room).emit('updateUserList', users.getUserList(room));
    // socket.leave('room name')


    // io.emit -> io.to('Room name').emit
    // socket.broadcast.emit -> socket.broadcast.to('Room name').emit
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', `Welcome to the room ${room}!`));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} joined the chat`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser({id: socket.id});

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', coords => {
    var user = users.getUser({id: socket.id});

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
