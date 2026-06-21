import express from 'express';
import { projectRoutes } from '../../modules/project/index.js';
import { gmailAccountRoutes } from "../../modules/gmail-account/index.js";
import { contactRoutes } from "../../modules/contact/index.js";

const router = express.Router();

router.use('/project', projectRoutes);
router.use('/gmail-account', gmailAccountRoutes);
router.use('/contact', contactRoutes);

export default router;