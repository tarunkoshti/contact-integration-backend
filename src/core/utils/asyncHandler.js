import { environment } from "../../config/base.js";
import Logger from "./logger.js";

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        if (environment === "development")
            return res
                .status(error.statusCode || 500)
                .json({ success: false, message: error.message || "Sorry, Something Went Wrong!", error: error });

        Logger.error(error);
    }
};

export default asyncHandler;
