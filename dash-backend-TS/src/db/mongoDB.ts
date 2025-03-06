import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {URI} from '../types/mongo';
dotenv.config(); // Load environment variables


const connectDB = async (): Promise<void> => {
  const uri: URI = process.env.MONGO_URI as string;
  try {
    await mongoose.connect(uri);
    console.log('Connected to database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
