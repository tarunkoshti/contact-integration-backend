import express from 'express';
import { projectRoutes } from '../../modules/project/index.js';
import { gmailAccountRoutes } from "../../modules/gmail-account/index.js";
import { contactRoutes } from "../../modules/contact/index.js";
import { authRoutes } from '../../modules/auth/index.js';
import { authHandler } from '../middlewares/authenticate.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/project', authHandler, projectRoutes);
router.use('/gmail-account', authHandler, gmailAccountRoutes);
router.use('/contact', authHandler, contactRoutes);

export default router;