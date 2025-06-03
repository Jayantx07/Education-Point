import Contact from '../models/contactModel.js';
import nodemailer from 'nodemailer';

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    const createdContact = await contact.save();

    // Send email notification (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to admin email
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <p>You have a new contact form submission:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Subject:</strong> ${subject}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        }
      });
    }

    res.status(201).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get contact message by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContactMessageById = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findById(req.params.id);

    if (message) {
      message.status = status || message.status;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (message) {
      await Contact.deleteOne({ _id: message._id });
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
};