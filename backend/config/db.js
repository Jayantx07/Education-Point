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
const MONGODB_ATLAS_URI = 'mongodb+srv://EducationPoint:educationpoint@cluster0.bvrlwvk.mongodb.net/education-point?retryWrites=true&w=majority&appName=EducationPoint';

const connectDB = async () => {
  try {
    // In production or deployment environments, always use the hardcoded URI for reliability
    // In development, use the environment variable if available
    const isProduction = process.env.NODE_ENV === 'production';
    const mongoUri = isProduction ? MONGODB_ATLAS_URI : (process.env.MONGO_URI || MONGODB_ATLAS_URI);
    
    // Safely log the URI without exposing credentials
    let safeUriForLogging;
    try {
      if (mongoUri.includes('@')) {
        const parts = mongoUri.split('@');
        const credentials = parts[0].split('//')[1];
        const hostPart = parts[1];
        safeUriForLogging = `${mongoUri.split('//')[0]}//${credentials.split(':')[0]}:****@${hostPart}`;
      } else {
        safeUriForLogging = 'MongoDB URI format is not standard';
      }
    } catch (err) {
      safeUriForLogging = 'Unable to parse MongoDB URI for logging';
    }
    
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Attempting to connect to MongoDB...`);
    
    const conn = await mongoose.connect(mongoUri);
    
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