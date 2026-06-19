import { ApiResponse } from "../../../core/utils/ApiResponse.js";
import { contactService } from "./contact.service.js";


const createContact = async (req, res) => {

    const { name, mobile } = req.body;

    const result =
        await contactService.createContact({
            name,
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