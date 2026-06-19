import dotenv from 'dotenv';
dotenv.config();

// Server entry point
import app from './app.js';
import { port } from './config/base.js';
import Logger from './core/utils/logger.js';

app
    .listen(port, () => {
        Logger.info(`server running on port : ${port}`);
    })
    .on('error', (e) => Logger.error(e));
