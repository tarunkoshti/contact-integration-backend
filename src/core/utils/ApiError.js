class ApiError extends Error {
    constructor(statusCode, message, errorCode) {
        super(message);

        this.statusCode = statusCode;
        this.errorCode = errorCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    toJSON() {
        return {
            status: false,
            statusCode: this.statusCode,
            message: this.message,
            errorCode: this.errorCode
        }
    }
}

export {
    ApiError
};