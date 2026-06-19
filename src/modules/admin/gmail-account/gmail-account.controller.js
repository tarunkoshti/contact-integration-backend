import oauth2Client from "../../../config/google.js";
import { ApiResponse } from "../../../core/utils/ApiResponse.js";
import { gmailAccountService } from "./gmail-account.service.js";

const googleLogin = async (req, res) => {

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/contacts"
        ]
    });

    return res.redirect(url);
};

const googleLoginCallback = async (req, res) => {

    const result =
        await gmailAccountService.handleGoogleCallback(
            req.query.code
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Gmail account added successfully"
        )
    );
};

const getAllAccounts = async (req, res) => {

    const result = await gmailAccountService.getAllAccounts();

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Accounts fetched successfully"
        )
    );
};

const makePrimaryAccount = async (req, res) => {

    await gmailAccountService.makePrimaryAccount(
        req.params.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Primary account updated successfully"
        )
    );
};

export const gmailAccountController = {
    googleLogin,
    googleLoginCallback,
    getAllAccounts,
    makePrimaryAccount
};