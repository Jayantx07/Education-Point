import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import * as courseService from '../../services/courseService';

// Placeholder for a CourseFormModal component (to be created)
const CourseFormModal = ({ isOpen, onClose, onSubmit, course, allInstructors }) => {
  const [formData, setFormData] = useState(course || {
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    price: '',
    instructor: '',
    image: '',
    features: [{ title: '', description: '' }],
    curriculum: [{ week: '', topics: '' }],
  });

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        level: '',
        duration: '',
        price: '',
        instructor: '',
        image: '',
        features: [{ title: '', description: '' }],
        curriculum: [{ week: '', topics: '' }],
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, e) => {
    const { name, value } = e.target;
    const newFeatures = [...formData.features];
    newFeatures[index][name] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, { title: '', description: '' }] }));
  };

 const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleCurriculumChange = (index, e) => {
    const { name, value } = e.target;
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index][name] = value;
    setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
  };

  const addCurriculumWeek = () => {
    setFormData(prev => ({ ...prev, curriculum: [...prev.curriculum, { week: '', topics: '' }] }));
  };

  const removeCurriculumWeek = (index) => {
    const newCurriculum = formData.curriculum.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <h2 className="text-2xl font-semibold mb-4">{course ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="3" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
              <select name="level" id="level" value={formData.level} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-white">
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (e.g., 8 Weeks)</label>
              <input type="text" name="duration" id="duration" value={formData.duration} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (INR)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
          </div>
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">Instructor</label>
            <select name="instructor" id="instructor" value={formData.instructor} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-white">
                <option value="">Select Instructor</option>
                {allInstructors && allInstructors.map(inst => <option key={inst._id} value={inst._id}>{inst.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" name="image" id="image" value={formData.image} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
          </div>
          
          {/* Features Section */}
          <div className="space-y-2">
            <h3 class="text-lg font-medium text-gray-700">Features</h3>
            {formData.features.map((feature, index) => (
              <div key={index} className="p-3 border rounded-md space-y-2">
                <input type="text" name="title" placeholder="Feature Title" value={feature.title} onChange={(e) => handleFeatureChange(index, e)} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                <textarea name="description" placeholder="Feature Description" value={feature.description} onChange={(e) => handleFeatureChange(index, e)} rows="2" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2"></textarea>
                {formData.features.length > 1 && <button type="button" onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-700 text-sm">Remove Feature</button>}
              </div>
            ))}
            <button type="button" onClick={addFeature} className="text-indigo-600 hover:text-indigo-800 text-sm">+ Add Feature</button>
          </div>

          {/* Curriculum Section */}
          <div className="space-y-2">
            <h3 class="text-lg font-medium text-gray-700">Curriculum</h3>
            {formData.curriculum.map((item, index) => (
              <div key={index} className="p-3 border rounded-md space-y-2">
                <input type="text" name="week" placeholder="Week / Module Title" value={item.week} onChange={(e) => handleCurriculumChange(index, e)} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                <textarea name="topics" placeholder="Topics Covered (comma-separated)" value={item.topics} onChange={(e) => handleCurriculumChange(index, e)} rows="2" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2"></textarea>
                {formData.curriculum.length > 1 && <button type="button" onClick={() => removeCurriculumWeek(index)} className="text-red-500 hover:text-red-700 text-sm">Remove Week/Module</button>}
              </div>
            ))}
            <button type="button" onClick={addCurriculumWeek} className="text-indigo-600 hover:text-indigo-800 text-sm">+ Add Week/Module</button>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{course ? 'Update Course' : 'Create Course'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};


const CoursesPanel = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', level: '' });

  const fetchCoursesAndInstructors = async () => {
    try {
      setLoading(true);
      const [coursesData, usersData] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getAllInstructors() // Assuming a service function to get instructors (users who are admins or have a teacher role)
      ]);
      setCourses(coursesData || []);
      setInstructors(usersData || []); // Ensure usersData is an array of potential instructors
    } catch (err) {
      console.error('Failed to fetch courses or instructors:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndInstructors();
  }, []);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.deleteCourse(courseId);
        setCourses(prev => prev.filter(c => c._id !== courseId));
        // Optionally, show a success toast/notification
      } catch (err) {
        console.error('Failed to delete course:', err);
        setError('Failed to delete course. Please try again.');
        // Optionally, show an error toast/notification
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCourse) {
        const updatedCourse = await courseService.updateCourse(editingCourse._id, formData);
        setCourses(prev => prev.map(c => c._id === editingCourse._id ? updatedCourse : c));
      } else {
        const newCourse = await courseService.createCourse(formData);
        setCourses(prev => [...prev, newCourse]);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      // Optionally, show a success toast/notification
    } catch (err) {
      console.error('Failed to save course:', err);
      setError('Failed to save course. Please try again.');
      // Optionally, show an error toast/notification
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredCourses = courses
    .filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(course => 
      (filters.category ? course.category === filters.category : true) &&
      (filters.level ? course.level === filters.level : true)
    );

  if (loading) return <div className="p-6 text-center"><p className="text-lg text-gray-500">Loading courses...</p></div>;
  if (error) return <div className="p-6 text-center"><p className="text-lg text-red-500">{error}</p></div>;

  return (
    <motion.div 
      className="p-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Courses</h2>
        <button 
          onClick={handleAddCourse} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 flex items-center space-x-2 transition duration-150"
        >
          <FiPlusCircle size={20} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Courses</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="search" 
                id="search" 
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">Filter by Category</label>
            <select 
              id="categoryFilter" 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
            >
              <option value="">All Categories</option>
              {[...new Set(courses.map(c => c.category))].map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="levelFilter" className="block text-sm font-medium text-gray-700">Filter by Level</label>
            <select 
              id="levelFilter" 
              name="level" 
              value={filters.level}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.length > 0 ? filteredCourses.map((course) => (
              <motion.tr 
                key={course._id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  <div className="text-xs text-gray-500">{course.duration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.level === 'Beginner' ? 'bg-green-100 text-green-800' : course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {course.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{course.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructors.find(inst => inst._id === course.instructor)?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleEditCourse(course)} className="text-indigo-600 hover:text-indigo-900"><FiEdit size={18} /></button>
                  <button onClick={() => handleDeleteCourse(course._id)} className="text-red-600 hover:text-red-900"><FiTrash2 size={18} /></button>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                  No courses found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CourseFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingCourse(null); }} 
        onSubmit={handleFormSubmit} 
        course={editingCourse}
        allInstructors={instructors} 
      />
    </motion.div>
  );
};

export default CoursesPanel;