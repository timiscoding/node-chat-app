import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';

export default [
  express.static(path.join(__dirname, '../../public')),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session({ secret: 'keyboard cat' }),
  passport.initialize(),
  passport.session(),
];