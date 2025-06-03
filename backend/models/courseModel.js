import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      enum: ['CUET', 'NEET', 'FOUNDATION', 'Pre-FOUNDATION', 'COMPUTER', 'MATHS', 'SCIENCE', 'SST', 'ENGLISH'],
    },
    level: {
      type: String,
      required: [true, 'Course level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    duration: {
      type: String,
      required: [true, 'Course duration is required'],
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    instructor: {
      name: {
        type: String,
        required: [true, 'Instructor name is required'],
      },
      bio: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    image: {
      type: String,
      required: [true, 'Course image is required'],
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    syllabus: [
      {
        title: String,
        description: String,
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;