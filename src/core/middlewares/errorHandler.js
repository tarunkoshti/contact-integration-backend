import { ApiError } from "../utils/ApiError.js";
import Logger from "../utils/logger.js";

function errorHandler(err, req, res, next) {
    Logger.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJSON());
    }

    res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: err.message || 'Internal Server Error',
    });
}

export {
    errorHandler
};