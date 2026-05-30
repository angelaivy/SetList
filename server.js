import express from 'express';
import authRoutes from './routes/auth';
import artistRoutes from './routes/artist';
import showRoutes from './routes/show';
import eventsRoutes from './routes/events';
import cors from 'cors'
// import routes from './routes/auth.js';

const server = express();
// add to railway: cd deployment-sample-frontend && npm install && npm run build in build section 
// do something similar to github actions 
const allowedOrigins = [
  'http://localhost:5173',
];
const deployedUrl = process.env.RAILWAY_PUBLIC_DOMAIN;
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
// server.use(routes);

export default server;
