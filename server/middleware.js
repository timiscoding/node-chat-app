import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import Session from 'express-session';
import flash from 'connect-flash';
import mongoose from 'mongoose';

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV === 'production') {
  const MongoStore = require('connect-mongo')(Session);
  sessionConfig.store = new MongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: 'native',
  });
} else if (process.env.NODE_ENV === 'development') {
  const FileStore = require('session-file-store')(Session);
  sessionConfig.store = new FileStore();
}

export const session = Session(sessionConfig);

export default [
  express.static(path.join(__dirname, '../../public')),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session,
  passport.initialize(),
  passport.session(),
  flash(),
];
