import express from 'express';
import routes from './routes/auth.js';

const server = express();
server.use(express.json());

server.use(routes);

export default server;
