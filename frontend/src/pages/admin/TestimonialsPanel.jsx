import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiEdit, FiTrash2, FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import * as testimonialService from '../../services/testimonialService';
import * as courseService from '../../services/courseService'; // To fetch course names

// Placeholder for TestimonialFormModal (similar to CourseFormModal but for testimonials)
const TestimonialFormModal = ({ isOpen, onClose, onSubmit, testimonial, allCourses }) => {
  const [formData, setFormData] = useState(testimonial || {
    name: '',
    image: '', // URL to image
    course: '', // Course ID
    rating: 5,
    testimonial: '',
    status: 'Pending' // Default status
  });

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    } else {
      setFormData({
        name: '',
        image: '',
        course: '',
        rating: 5,
        testimonial: '',
        status: 'Pending'
      });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <h2 className="text-2xl font-semibold mb-4">{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" name="image" id="image" value={formData.image} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
            <select name="course" id="course" value={formData.course} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white">
              <option value="">Select Course</option>
              {allCourses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input type="number" name="rating" id="rating" value={formData.rating} onChange={handleChange} min="1" max="5" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700">Testimonial Content</label>
            <textarea name="testimonial" id="testimonial" value={formData.testimonial} onChange={handleChange} rows="4" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-white">
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{testimonial ? 'Update Testimonial' : 'Create Testimonial'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const TestimonialsPanel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // 'Pending', 'Approved', 'Rejected', '' for all

  const fetchData = async () => {
    try {
      setLoading(true);
      const [testimonialsData, coursesData] = await Promise.all([
        testimonialService.getAllTestimonials(),
        courseService.getAllCourses() // Fetch all courses for mapping names
      ]);
      setTestimonials(testimonialsData || []);
      setCourses(coursesData || []);
    } catch (err) {
      console.error('Failed to fetch testimonials or courses:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialService.deleteTestimonial(testimonialId);
        setTestimonials(prev => prev.filter(t => t._id !== testimonialId));
      } catch (err) {
        console.error('Failed to delete testimonial:', err);
        setError('Failed to delete testimonial. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (testimonialId, status) => {
    try {
      const updatedTestimonial = await testimonialService.updateTestimonial(testimonialId, { status });
      setTestimonials(prev => prev.map(t => t._id === testimonialId ? updatedTestimonial : t));
    } catch (err) {
      console.error('Failed to update testimonial status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTestimonial) {
        const updated = await testimonialService.updateTestimonial(editingTestimonial._id, formData);
        setTestimonials(prev => prev.map(t => t._id === editingTestimonial._id ? updated : t));
      } else {
        const newTestimonial = await testimonialService.createTestimonial(formData);
        setTestimonials(prev => [...prev, newTestimonial]);
      }
      setIsModalOpen(false);
      setEditingTestimonial(null);
    } catch (err) {
      console.error('Failed to save testimonial:', err);
      setError('Failed to save testimonial. Please try again.');
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course ? course.title : 'N/A';
  };

  const filteredTestimonials = testimonials
    .filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.testimonial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCourseName(t.course).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(t => 
      filterStatus ? t.status === filterStatus : true
    );

  if (loading) return <div className="p-6 text-center"><p className="text-lg text-gray-500">Loading testimonials...</p></div>;
  if (error) return <div className="p-6 text-center"><p className="text-lg text-red-500">{error}</p></div>;

  return (
    <motion.div 
      className="p-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Testimonials</h2>
        <button 
          onClick={handleAddTestimonial} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 flex items-center space-x-2 transition duration-150"
        >
          <FiPlusCircle size={20} />
          <span>Add New Testimonial</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="searchTestimonial" className="block text-sm font-medium text-gray-700">Search Testimonials</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="searchTestimonial" 
                id="searchTestimonial" 
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2"
                placeholder="Search by name, content, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select 
              id="statusFilter" 
              name="statusFilter" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTestimonials.length > 0 ? filteredTestimonials.map((testimonial) => (
              <motion.tr 
                key={testimonial._id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {testimonial.image && <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={testimonial.image} alt={testimonial.name} />
                    </div>}
                    <div className={testimonial.image ? "ml-4" : ""}>
                      <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCourseName(testimonial.course)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{'⭐'.repeat(testimonial.rating)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${testimonial.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      testimonial.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {testimonial.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {testimonial.status === 'Pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(testimonial._id, 'Approved')} className="text-green-600 hover:text-green-900" title="Approve"><FiCheckCircle size={18} /></button>
                      <button onClick={() => handleUpdateStatus(testimonial._id, 'Rejected')} className="text-orange-600 hover:text-orange-900" title="Reject"><FiXCircle size={18} /></button>
                    </>
                  )}
                  <button onClick={() => handleEditTestimonial(testimonial)} className="text-indigo-600 hover:text-indigo-900" title="Edit"><FiEdit size={18} /></button>
                  <button onClick={() => handleDeleteTestimonial(testimonial._id)} className="text-red-600 hover:text-red-900" title="Delete"><FiTrash2 size={18} /></button>
                  {/* <button onClick={() => alert(testimonial.testimonial)} className="text-gray-600 hover:text-gray-900" title="View Content"><FiEye size={18} /></button> */}
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                  No testimonials found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TestimonialFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTestimonial(null); }} 
        onSubmit={handleFormSubmit} 
        testimonial={editingTestimonial}
        allCourses={courses}
      />
    </motion.div>
  );
};

export default TestimonialsPanel;