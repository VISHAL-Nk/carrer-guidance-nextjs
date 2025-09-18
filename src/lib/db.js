import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;
  const uri = process.env.DB_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('DB_URI or MONGODB_URI not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  isConnected = true;
  return mongoose.connection;
}

export default connectDB;
