import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createContactMessage)
  .get(protect, admin, getContactMessages);

router.route('/:id')
  .get(protect, admin, getContactMessageById)
  .put(protect, admin, updateContactMessageStatus)
  .delete(protect, admin, deleteContactMessage);

export default router;