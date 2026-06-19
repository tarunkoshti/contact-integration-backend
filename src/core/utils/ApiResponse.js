class ApiResponse {
    constructor(statusCode, data, message) {
        this.success = true;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }

    toJSON() {
        return {
            status: this.status,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data
        }
    }
}

export {
    ApiResponse
};