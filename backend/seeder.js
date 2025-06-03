import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Course from './models/courseModel.js';
import Testimonial from './models/testimonialModel.js';
import Contact from './models/contactModel.js';
import { dummyUsers, dummyCourses, dummyTestimonials, dummyContacts } from './data/dummyData.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import data into database
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Testimonial.deleteMany();
    await Contact.deleteMany();

    console.log('Data cleared from database');

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      dummyUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`${createdUsers.length} users imported`);

    // Get admin user ID
    const adminUser = createdUsers.find((user) => user.isAdmin);

    // Insert courses with admin user as reference
    const coursesWithAdmin = dummyCourses.map((course) => {
      return { ...course, user: adminUser._id };
    });

    const createdCourses = await Course.insertMany(coursesWithAdmin);
    console.log(`${createdCourses.length} courses imported`);

    // Insert testimonials with admin user as reference
    const testimonialsWithAdmin = dummyTestimonials.map((testimonial) => {
      return { ...testimonial, user: adminUser._id };
    });

    const createdTestimonials = await Testimonial.insertMany(testimonialsWithAdmin);
    console.log(`${createdTestimonials.length} testimonials imported`);

    // Insert contacts
    const createdContacts = await Contact.insertMany(dummyContacts);
    console.log(`${createdContacts.length} contacts imported`);

    console.log('Data import completed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from database
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Testimonial.deleteMany();
    await Contact.deleteMany();

    console.log('All data destroyed from database');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}