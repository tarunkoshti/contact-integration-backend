import express from 'express';
import asyncHandler from '../../../core/utils/asyncHandler.js';
import { gmailAccountController } from './gmail-account.controller.js';

const router = express.Router();

router.get('/', asyncHandler(gmailAccountController.getAllAccounts));
router.get('/google/login', asyncHandler(gmailAccountController.googleLogin));
router.get('/google/callback', asyncHandler(gmailAccountController.googleLoginCallback));
router.patch('/:id/primary', asyncHandler(gmailAccountController.makePrimaryAccount));

export default router;
