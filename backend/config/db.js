import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables are loaded
// Try to load from .env file in the parent directory (backend folder)
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// MongoDB Atlas connection string - hardcoded for reliability
// This is used as a fallback and in deployment environments
export const MONGODB_ATLAS_URI = 'mongodb+srv://EducationPoint:educationpoint@cluster0.bvrlwvk.mongodb.net/education-point?retryWrites=true&w=majority&appName=EducationPoint';

const connectDB = async () => {
  try {
    // Always use the hardcoded URI for reliability in all environments
    // This ensures consistent connection behavior regardless of environment variables
    const mongoUri = MONGODB_ATLAS_URI;
    
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Attempting to connect to MongoDB Atlas...`);
    
    // Set connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    const conn = await mongoose.connect(mongoUri, options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error stack:', error.stack);
    
    // Don't exit the process in production, allow for retry mechanisms
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    
    throw error; // Re-throw for handling by caller
  }
};

export default connectDB;