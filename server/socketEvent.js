import mongoose from 'mongoose';

import isRealString from './utils/validation';
import { generateMessage, generateLocationMessage } from './utils/message';
import Users from './utils/users';

const users = Users.getInstance();
const User = mongoose.model('User');

// update room list for people joining a room
const updateUserJoining = (io) => {
  io.emit('updateRoomList', { rooms: users.getRoomList() });
};

const joinRoom = (socket, io) => socket.on('join', async (params, callback) => {
  if (!isRealString(params.room)) {
    return callback('Room name required!');
  }

  const room = params.room.trim().toLowerCase();
  socket.join(room);

  const { passport } = socket.handshake.session;
  let name;
  if (passport && passport.user) {
    try {
      const user = await User.findById(passport.user);
      name = user.username;
    } catch (err) {
      return callback('Could not retrieve user information');
    }
  } else {
    let size = -4;
    do {
      name = `guest-${socket.id.slice(size).toLowerCase()}`;
      size -= 1;
    } while (users.getUser({ name }));
  }

  users.removeUser(socket.id);
  users.addUser(socket.id, name, room);
  io.to(room).emit('updateUserList', users.getUserList(room));
  socket.emit('newMessage', generateMessage('Admin', `Welcome to the room ${room}!`));
  socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} joined the chat`));

  updateUserJoining(io);
  return callback();
});

const createMessage = (socket, io) => socket.on('createMessage', (message, callback) => {
  const user = users.getUser({ id: socket.id });

  if (user && isRealString(message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  }
  callback();
});

const createLocationMessage = (socket, io) => socket.on('createLocationMessage', (coords) => {
  const user = users.getUser({ id: socket.id });

  if (user) {
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
  }
});

const disconnect = (socket, io) => socket.on('disconnect', () => {
  const user = users.removeUser(socket.id);

  io.to(user.room).emit('updateUserList', users.getUserList(user.room));
  io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
  updateUserJoining(io);
});

const getRoomList = socket => socket.on('getRoomList', (_, callback) => {
  callback({ rooms: users.getRoomList() });
});

export default (socket, io) => ({
  joinRoom: joinRoom(socket, io),
  createMessage: createMessage(socket, io),
  createLocationMessage: createLocationMessage(socket, io),
  disconnect: disconnect(socket, io),
  getRoomList: getRoomList(socket, io),
});
