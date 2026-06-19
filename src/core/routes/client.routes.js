import express from 'express';
import { contactRoutes } from '../../modules/client/contact/index.js';

const router = express.Router();

router.use('/contact', contactRoutes);

export default router;
