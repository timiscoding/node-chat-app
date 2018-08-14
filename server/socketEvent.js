import mongoose from 'mongoose';

import isRealString from './utils/validation';
import { generateMessage, generateLocationMessage } from './utils/message';
import Users from './utils/users';
import Room from './models/room.model';
import Message from './models/message.model';

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

  const roomName = params.room.trim().toLowerCase();
  socket.join(roomName);

  const { passport } = socket.handshake.session;
  let name, mongoUserId;
  if (passport && passport.user) {
    try {
      const user = await User.findById(passport.user);
      name = user.username;
      mongoUserId = user.id;
    } catch (err) {
      return callback('Could not retrieve user information');
    }
  } else {
    const objectId = new mongoose.Types.ObjectId;
    name = `guest-${objectId.toString().slice(-4)}`;
    await User.create({ username: name, _id: objectId });
    mongoUserId = objectId.toString();
  }

  try {
    const room = await Room.findOne({ name: roomName });

    if (!room) {
      await Room.create({ name: roomName });
    }
  } catch (err) {
    return callback('Could not create room');
  }

  let messages;
  try {
    messages = await Message
      .find({ to: roomName }, { _id: 0 }, { sort: { createdAt: 1 }})
      .populate('from', { username: 1, _id: 0 });
  } catch (err) {
    return callback('Could not get message history');
  }

  users.removeUser(socket.id);
  users.addUser(socket.id, name, roomName, mongoUserId);
  io.to(roomName).emit('updateUserList', users.getUserList(roomName));
  socket.emit('newMessage', generateMessage('Admin', `Welcome to the room ${roomName}!`));
  socket.broadcast.to(roomName).emit('newMessage', generateMessage('Admin', `${name} joined the chat`));

  updateUserJoining(io);
  return callback(null, messages);
});

const createMessage = (socket, io) => socket.on('createMessage', async (message, callback) => {
  const user = users.getUser({ id: socket.id });

  if (user && isRealString(message.text)) {
    try {
      await Message.create({ from: user.mongoId, to: user.room, content: message.text });
    } catch (err) {
      return callback('Error persisting message to db');
    }

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
