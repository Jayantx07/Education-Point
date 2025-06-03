import mongoose from 'mongoose';

// MongoDB Atlas connection string - hardcoded for testing
const MONGODB_ATLAS_URI = 'mongodb+srv://EducationPoint:educationpoint@cluster0.bvrlwvk.mongodb.net/education-point?retryWrites=true&w=majority&appName=EducationPoint';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(MONGODB_ATLAS_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // List all collections in the database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(` - ${collection.name}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
  }
}

testConnection();