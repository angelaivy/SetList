import express from 'express';
import authRoutes from './routes/auth';
import artistRoutes from './routes/artist';
import showRoutes from './routes/show';
import eventsRoutes from './routes/events';
import cors from 'cors'

const server = express();
const allowedOrigins = [
  'http://localhost:5173',
];
const deployedUrl = process.env.RAILWAY_PUBLIC_DOMAIN;
/* istanbul ignore next */
if (deployedUrl) {
  allowedOrigins.push(deployedUrl);
}

server.use(cors({
  origin: allowedOrigins
}));

server.use(express.static('set-list/dist'))
server.use(express.json());
server.use('/auth', authRoutes);
server.use('/artist', artistRoutes);
server.use('/show', showRoutes);
server.use('/events', eventsRoutes);

export default server;
