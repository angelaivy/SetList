import express from 'express';
import authRoutes from './routes/auth';
import artistRoutes from './routes/artist';
import showRoutes from './routes/show';
import eventsRoutes from './routes/events';

const server = express();
server.use(express.json());

server.use('/auth', authRoutes);
server.use('/artist', artistRoutes);
server.use('/show', showRoutes);
server.use('/events', eventsRoutes);

export default server;
