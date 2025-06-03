import express from 'express';
import mongoose from 'mongoose';
import { MONGODB_ATLAS_URI } from './config/db.js';

const app = express();
const PORT = 3000;

// Simple test route
app.get('/', (req, res) => {
  res.send('Test server is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: {
      connected: mongoose.connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    }
  };
  
  res.status(200).json(health);
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_ATLAS_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);
  await connectToMongoDB();
});