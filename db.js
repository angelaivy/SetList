import mongoose from 'mongoose';
import server from './server';
import 'dotenv/config';

const { PORT = 3000, MONGO_CONNECT_URI } = process.env;

mongoose
  .connect('mongodb://127.0.0.1/setlist', {})
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
