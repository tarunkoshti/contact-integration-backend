import { google } from "googleapis";
import oauth2Client from "../../../config/google.js";
import { google as googleConfig } from "../../../config/base.js";
import { gmailAccountRepository } from "./gmail-account.repository.js";
import { ApiError } from "../../../core/utils/ApiError.js";
import pool from "../../../config/db.js";

const handleGoogleCallback = async (code) => {

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        version: "v2",
        auth: oauth2Client
    });

    const { data } = await oauth2.userinfo.get();

    const existingAccount =
        await gmailAccountRepository.findByEmail(
            data.email
        );

    if (existingAccount) {
        throw new ApiError(
            409,
            "This Gmail account is already added."
        );
    }

    const totalPrimary =
        await gmailAccountRepository.getPrimaryCount();

    const primaryStatus =
        totalPrimary === 0 ? 1 : 0;

    await gmailAccountRepository.createAccount({
        gmail_id: data.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        client_id: googleConfig.client_id,
        client_secret: googleConfig.client_secret,
        primary_status: primaryStatus
    });

    return {
        email: data.email,
        primary_status: primaryStatus
    };
};

const getAllAccounts = async () => {
    return await gmailAccountRepository.getAllAccounts();
};

const makePrimaryAccount = async (id) => {

    const account = await gmailAccountRepository.findById(id);

    if (!account) {
        throw new ApiError(
            404,
            "Gmail account not found"
        );
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();
        await gmailAccountRepository.removePrimaryAccount(connection);
        await gmailAccountRepository.setPrimaryAccount(connection, id);
        await connection.commit();

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }

    // await gmailAccountRepository.removePrimaryAccount();

    // await gmailAccountRepository.setPrimaryAccount(id);

    return null;
};

const getPrimaryAccount = async () => {
    return await gmailAccountRepository.getPrimaryAccount();
};

const updateAccessToken = async (id, accessToken) => {
    await gmailAccountRepository.updateAccessToken(id, accessToken);
};

export const gmailAccountService = {
    handleGoogleCallback,
    getAllAccounts,
    makePrimaryAccount,
    getPrimaryAccount,
    updateAccessToken
};