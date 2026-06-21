import { ApiError } from "../../core/utils/ApiError.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { contactService } from "./contact.service.js";


const createContact = async (req, res) => {

    const { projectId, mobile } = req.body;

    if (!projectId) throw new ApiError(400, "Project Id is required");
    if (!mobile) throw new ApiError(400, "Mobile is required");
    if (!/^\d{10}$/.test(String(mobile))) {
        throw new ApiError(
            400,
            "Mobile must be a valid 10 digit number"
        );
    }

    const result =
        await contactService.createContact({
            projectId,
            mobile
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            result,
            "Contact created successfully"
        )
    );
};

export const contactController = {
    createContact
};