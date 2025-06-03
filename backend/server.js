import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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

// Connect to MongoDB
connectDB();

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