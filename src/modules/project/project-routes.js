import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { projectController } from './project-controller.js';

const router = express.Router();

router.post('/', asyncHandler(projectController.createProject));
router.get('/', asyncHandler(projectController.getAllProjects));

export default router;
