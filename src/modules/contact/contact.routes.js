import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { contactController } from './contact.controller.js';

const router = express.Router();

router.post('/save-contact', asyncHandler(contactController.createContact));

export default router;
