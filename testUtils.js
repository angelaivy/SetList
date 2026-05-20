import mongoose from 'mongoose';
import User from './models/user';
import Artist from './models/artist';
import Show from './models/show';

const models = [User, Artist, Show];

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {});
  await Promise.all(models.map((m) => m.syncIndexes()));
};

export const stopDB = async () => {
  await mongoose.disconnect();
};

export const clearDB = async () => {
  await Promise.all(models.map((model) => model.deleteMany()));
};
