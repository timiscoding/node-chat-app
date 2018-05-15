import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

export default [
  express.static(path.join(__dirname, '../../public')),
  bodyParser.json(),
  bodyParser.urlencoded(),
];
