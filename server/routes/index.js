import express from 'express';
import { userRouter } from './user.router';
import { authRouter } from './auth.router';

const routes = express.Router();

routes.use('/', authRouter);
routes.use('/', userRouter);

routes.get('/', (req, res) => {
  res.render('index', { title: 'Join' });
});

routes.post('/chat', (req, res) => {
  res.render('chat', { title: 'Chat' });
});

// handle mongoose validation errors
routes.use((err, req, res, next) => {
  if (!err.errors) {
    return next(err);
  }

  const validationErrors = Object.keys(err.errors);

  if (validationErrors.length > 0) {
    validationErrors.forEach(e => req.flash('error', err.errors[e].message));
  }
  return res.redirect('back');
});

routes.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(500).send(`something messed up: ${err.message}`);
});

export default routes;
