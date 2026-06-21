import express from 'express';
import asyncHandler from '../../core/utils/asyncHandler.js';
import { authController } from './auth.controller.js';
import { authHandler } from '../../core/middlewares/authenticate.js';

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', authHandler, asyncHandler(authController.me));

export default router;
