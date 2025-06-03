import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { submitContactForm } from '../services/contactService';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'Contact Us - Education Point';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      await submitContactForm(formData);
      setSubmitStatus('success');
      setSubmitMessage('Your message has been sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000); // Clear message after 5s
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to send message. Please try again later.');
      setTimeout(() => setSubmitStatus(null), 7000); // Clear error message after 7s
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiPhone className="text-xl" />,
      title: 'Phone',
      details: [
        'RAM SIR: 8059853968',
        'SURYADEV SIR: 8209797019',
      ],
    },
    {
      icon: <FiMail className="text-xl" />,
      title: 'Email',
      details: [
        'info@educationpoint.com',
        'admissions@educationpoint.com',
      ],
    },
    {
      icon: <FiMapPin className="text-xl" />,
      title: 'Location',
      details: [
        'The Education Point',
        'Main Campus, City Center',
      ],
    },
    {
      icon: <FiClock className="text-xl" />,
      title: 'Working Hours',
      details: [
        'Monday - Saturday: 8:00 AM - 8:00 PM',
        'Sunday: Closed',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Header */}
      <div className="bg-primary text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-primary opacity-90"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Have questions about our courses or want to enroll? Get in touch with us and we'll be happy to help.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Feel free to reach out to us with any questions or inquiries. We're here to help you on your educational journey.
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-lg flex items-center ${submitStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {submitStatus === 'success' ? <FiCheckCircle className="mr-2 flex-shrink-0" /> : <FiAlertCircle className="mr-2 flex-shrink-0" />}
                    {submitMessage}
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Course Inquiry"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <FiLoader className="animate-spin mr-2" />
                    ) : (
                      <FiSend className="mr-2" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Find Us On Map</h2>
          <div className="h-96 rounded-xl overflow-hidden shadow-lg">
            {/* Replace with actual Google Maps embed */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-600">Google Maps will be embedded here</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;