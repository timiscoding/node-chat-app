import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session);

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};

if (process.NODE_ENV === 'production') {
  sessionConfig.store = new MongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: 'native',
  });
}

export default [
  express.static(path.join(__dirname, '../public')),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session(sessionConfig),
  passport.initialize(),
  passport.session(),
  flash(),
];
