import mongoose from 'mongoose';
import env from '../config/env.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(`server is connected to mongodb`);
  } catch (error) {
    console.log(`error in connecting mongodb ${error}`);
  }
};
