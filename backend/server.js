import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// Routes
import courseRoutes from './routes/courseRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import userRoutes from './routes/userRoutes.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
// Try to load from .env file in the current directory
const envPath = path.resolve(__dirname, '.env');
console.log(`Looking for .env file at: ${envPath}`);
const envFileExists = fs.existsSync(envPath);
console.log(`File exists: ${envFileExists}`);

// Load environment variables from .env file if it exists
if (envFileExists) {
  dotenv.config({ path: envPath });
} else {
  // If .env file doesn't exist, try loading from default location
  dotenv.config();
  console.log('Using default dotenv.config() as .env file was not found at the specified path');
}

// Log environment variables (without sensitive data)
console.log('Environment variables loaded:');
console.log(`PORT: ${process.env.PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`MONGO_URI defined: ${Boolean(process.env.MONGO_URI)}`);

// Connect to MongoDB with retry mechanism
let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 5;

(async function connectWithRetry() {
  try {
    if (!isConnected && retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`MongoDB connection attempt ${retryCount} of ${MAX_RETRIES}...`);
      await connectDB();
      isConnected = true;
      console.log('MongoDB connection established successfully');
    }
  } catch (error) {
    console.error(`Failed to connect to MongoDB (attempt ${retryCount}/${MAX_RETRIES})`);
    console.error(`Error: ${error.message}`);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in 5 seconds...`);
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    } else {
      console.error('Maximum retry attempts reached. Starting server without MongoDB connection.');
      // Continue with server startup even if MongoDB connection fails
      // This allows the server to handle requests that don't require database access
    }
  }
})();

// Start the server regardless of database connection status
// This ensures the application is responsive even if the database is temporarily unavailable

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://education-point.netlify.app', 'https://www.education-point.com'] // Add your Netlify domain and any other domains
    : 'http://localhost:5173', // Vite's default port for development
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Education Point API is running...');
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    },
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(health);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;