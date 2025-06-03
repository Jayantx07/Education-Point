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

// MongoDB Atlas connection string from .env file
// This is the hardcoded fallback in case the environment variable is not available
const MONGODB_ATLAS_URI = 'mongodb://EducationPoint:educationpoint@ac-fsz63gw-shard-00-00.bvrlwvk.mongodb.net:27017,ac-fsz63gw-shard-00-01.bvrlwvk.mongodb.net:27017,ac-fsz63gw-shard-00-02.bvrlwvk.mongodb.net:27017/?ssl=true&replicaSet=atlas-tjubde-shard-0&authSource=admin&retryWrites=true&w=majority&appName=EducationPoint';

const connectDB = async () => {
  try {
    // Use the environment variable if available, otherwise use the hardcoded URI
    const mongoUri = process.env.MONGO_URI || MONGODB_ATLAS_URI;
    
    // Log the MongoDB URI being used (without sensitive credentials)
    const mongoUriForLogging = mongoUri 
      ? `${mongoUri.split('@')[0].split(':')[0]}:****@${mongoUri.split('@')[1]}`
      : 'MongoDB URI is not defined';
    
    console.log(`Attempting to connect to MongoDB with URI: ${mongoUriForLogging}`);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    process.exit(1);
  }
};

export default connectDB;