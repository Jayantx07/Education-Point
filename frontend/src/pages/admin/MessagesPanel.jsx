import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiCheckSquare, FiSquare, FiTrash2, FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import * as contactService from '../../services/contactService';
import { format } from 'date-fns'; // For formatting dates

// Modal to view full message content
const MessageViewModal = ({ isOpen, onClose, message }) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Message from: {message.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <p><strong>Email:</strong> {message.email}</p>
          <p><strong>Phone:</strong> {message.phone || 'N/A'}</p>
          <p><strong>Subject:</strong> {message.subject}</p>
          <p><strong>Received:</strong> {format(new Date(message.createdAt), 'PPpp')}</p>
          <hr className="my-2"/>
          <p className="whitespace-pre-wrap"><strong>Message:</strong><br/>{message.message}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MessagesPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // 'Read', 'Unread', '' for all
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContactMessages();
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleStatus = async (messageId, currentStatus) => {
    const newStatus = currentStatus === 'Read' ? 'Unread' : 'Read';
    try {
      const updatedMessage = await contactService.updateContactMessageStatus(messageId, newStatus);
      setMessages(prev => prev.map(msg => msg._id === messageId ? updatedMessage : msg));
    } catch (err) {
      console.error('Failed to update message status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.deleteContactMessage(messageId);
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      } catch (err) {
        console.error('Failed to delete message:', err);
        setError('Failed to delete message. Please try again.');
      }
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
    // Optionally mark as read when viewed
    if (message.status !== 'Read') {
      handleToggleStatus(message._id, message.status);
    }
  };

  const filteredMessages = messages
    .filter(msg => 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(msg => 
      filterStatus ? msg.status === filterStatus : true
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

  if (loading) return <div className="p-6 text-center"><p className="text-lg text-gray-500">Loading messages...</p></div>;
  if (error) return <div className="p-6 text-center"><p className="text-lg text-red-500">{error}</p></div>;

  return (
    <motion.div 
      className="p-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Contact Messages</h2>
        {/* Optional: Add button if needed, e.g., for bulk actions */}
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="searchMessage" className="block text-sm font-medium text-gray-700">Search Messages</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                name="searchMessage" 
                id="searchMessage" 
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2"
                placeholder="Search by name, email, subject, content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="messageStatusFilter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select 
              id="messageStatusFilter" 
              name="messageStatusFilter" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMessages.length > 0 ? filteredMessages.map((message) => (
              <motion.tr 
                key={message._id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`${message.status === 'Unread' ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{message.name}</div>
                  <div className="text-xs text-gray-500">{message.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate" title={message.subject}>{message.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${message.status === 'Read' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    onClick={() => handleToggleStatus(message._id, message.status)}
                    title={`Mark as ${message.status === 'Read' ? 'Unread' : 'Read'}`}
                  >
                    {message.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button onClick={() => handleViewMessage(message)} className="text-blue-600 hover:text-blue-900" title="View Message"><FiEye size={18} /></button>
                  <button onClick={() => handleToggleStatus(message._id, message.status)} className={message.status === 'Read' ? "text-gray-600 hover:text-gray-900" : "text-green-600 hover:text-green-900"} title={message.status === 'Read' ? "Mark as Unread" : "Mark as Read"}>
                    {message.status === 'Read' ? <FiSquare size={18} /> : <FiCheckSquare size={18} />}
                  </button>
                  <button onClick={() => handleDeleteMessage(message._id)} className="text-red-600 hover:text-red-900" title="Delete Message"><FiTrash2 size={18} /></button>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <MessageViewModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        message={selectedMessage} 
      />
    </motion.div>
  );
};

export default MessagesPanel;