require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const morgan = require('morgan');
server.use(morgan('dev'));
const apiRouter = require('./api');
server.use(express.json());
server.use('/api', apiRouter);
const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});