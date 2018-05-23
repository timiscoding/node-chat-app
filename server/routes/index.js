import express from 'express';
import passport from 'passport';
import { userRouter } from './user.router';

const routes = express.Router();

routes.get('/login', (req, res) => {
  res.send('<p>login form</p>');
});
routes.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
}));
routes.use('/user', userRouter);

routes.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(500).send(`Something messed up... ${err.message}`);
});

export default routes;
