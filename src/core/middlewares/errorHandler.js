import { ApiError } from "../utils/ApiError.js";

function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err.toJSON());
    }
    console.log(err);
    res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Internal Server Error',
    });
}

export {
    errorHandler
};