import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log(`Looking for .env file at: ${envPath}`);
console.log(`File exists: ${fs.existsSync(envPath)}`);

dotenv.config({ path: envPath });

// Test MongoDB connection
async function testConnection() {
  try {
    console.log('Environment variables:');
    console.log(`PORT: ${process.env.PORT}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`MONGO_URI defined: ${Boolean(process.env.MONGO_URI)}`);
    
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    // Log the MongoDB URI being used (without sensitive credentials)
    const mongoUriForLogging = process.env.MONGO_URI 
      ? `${process.env.MONGO_URI.split('@')[0].split(':')[0]}:****@${process.env.MONGO_URI.split('@')[1]}`
      : 'MongoDB URI is not defined';
    
    console.log(`Attempting to connect to MongoDB with URI: ${mongoUriForLogging}`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
  }
}

testConnection();