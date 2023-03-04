import mongoose from 'mongoose';
import { config } from '../config';

const { cluster, name, passwd, user } = config;

export const dbConnect = () => {
  const url = `mongodb+srv://${user}:${passwd}@${cluster}/${name}?retryWrites=true&w=majority`;
  return mongoose.connect(url);
};
