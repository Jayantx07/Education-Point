import Course from '../models/courseModel.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by title if provided
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Only show active courses
    query.isActive = true;

    const courses = await Course.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular courses
// @route   GET /api/courses/popular
// @access  Public
const getPopularCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPopular: true, isActive: true }).limit(6);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      Object.keys(req.body).forEach((key) => {
        course[key] = req.body[key];
      });

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await Course.deleteOne({ _id: course._id });
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCourses,
  getPopularCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};