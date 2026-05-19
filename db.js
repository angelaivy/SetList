import mongoose from 'mongoose';
import server from './server';
import 'dotenv/config';

const { PORT = 3000, MONGO_CONNECT_URI, RAILWAY_ENVIRONMENT_ID } = process.env;
const isRailway = RAILWAY_ENVIRONMENT_ID !== undefined;
let setConnection;

if (isRailway) {
  setConnection = MONGO_CONNECT_URI;
} else {
  setConnection = 'mongodb://127.0.0.1/setlist';
}

mongoose
  .connect(setConnection, {})
  .then(() => {
    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(`Failed to start server:`, e);
  });
