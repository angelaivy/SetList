import express from 'express';
import authRoutes from './routes/auth';
import artistRoutes from './routes/artist';

const server = express();
server.use(express.json());

server.use('/auth', authRoutes);
server.use('/artist', artistRoutes);

export default server;
