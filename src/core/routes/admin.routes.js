import express from 'express';

import { gmailAccountRoutes } from '../../modules/admin/gmail-account/index.js';

const router = express.Router();

router.use('/gmail-account', gmailAccountRoutes);

export default router;
