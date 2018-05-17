import express from 'express';
import { userRouter } from './user.router';
import usersModel from '../utils/users';

const routes = express.Router();
const users = usersModel.getInstance();

routes.use('/user', userRouter);
routes.get('/', (req, res) => {
  const rooms = users.getRoomList();
  res.render('join', { rooms, roomCount: rooms.length });
});
routes.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(500).send(`Something messed up... ${err.message}`);
});

export default routes;
