import cors from 'cors';
import express from 'express';
import { errorHandler } from './core/middlewares/errorHandler.js';
import logger from './core/utils/logger.js';
import { adminRoutes, clientRoutes } from './core/routes/index.js';
import pool from './config/db.js';

// Verify database connection
const connectDb = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info("Database connected successfully");
        connection.release();
    } catch (err) {
        logger.error("Database connection failed: " + err.message);
    }
}
connectDb();

const app = express();

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} from ${req.ip} (Origin: ${req.get('origin')})`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
    'http://localhost:5173',
    'https://contact-integration-frontend.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.get('/', (req, res) => res.send('ok'));

// catch 404 and forward to error handler
app.use((req, res, next) => next(new Error('Route Not Found')));

// Middleware Error Handler
app.use(errorHandler);

export default app;
