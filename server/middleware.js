import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';

export default [
  express.static(path.join(__dirname, '../public')),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }),
  passport.initialize(),
  passport.session(),
  flash(),
];
