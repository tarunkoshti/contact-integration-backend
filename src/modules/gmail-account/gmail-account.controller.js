import { environment, frontendUrl } from "../../config/base.js";
import oauth2Client from "../../config/google.js";
import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { gmailAccountService } from "./gmail-account.service.js";

const googleLogin = async (req, res) => {

    const { projectId } = req.query;

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        state: projectId,
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
    try {
        await gmailAccountService.handleGoogleCallback({
            code: req.query.code,
            projectId: req.query.state
        });
        console.log("environment", environment, environment === 'development');
        return res.redirect(`${frontendUrl}/?auth=success`);
    } catch (error) {
        console.error(error);
        const errorMsg = encodeURIComponent(error.message || 'Failed to add Gmail account');
        return res.redirect(`${frontendUrl}/?auth=error&message=${errorMsg}`);
    }
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