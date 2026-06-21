import { google } from "googleapis";
import { gmailAccountService } from "../gmail-account/gmail-account.service.js";
import oauth2Client from "../../config/google.js";
import { ApiError } from "../../core/utils/ApiError.js";
import pool from "../../config/db.js";

const createContact = async ({ projectId, mobile }) => {

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const primaryAccountByProject = await gmailAccountService.getPrimaryAccountByProjectForUpdate(connection, projectId);

        if (!primaryAccountByProject) {
            throw new ApiError(
                404,
                `No primary email configured for this project.`
            );
        }

        const nextNumber = primaryAccountByProject.last_saved_number + 1;

        const name = `w${String(nextNumber).padStart(5, "0")}`;

        oauth2Client.setCredentials({
            // access_token: primaryAccountByProject.access_token,
            refresh_token: primaryAccountByProject.refresh_token
        });

        const people = google.people({
            version: "v1",
            auth: oauth2Client
        });

        let response;

        try {
            response =
                await people.people.createContact({
                    requestBody: {
                        names: [
                            {
                                givenName: name,
                                displayName: name
                            }
                        ],
                        phoneNumbers: [
                            {
                                value: mobile.toString()
                            }
                        ]
                    }
                });

        } catch (error) {

            // we don't need it because google handle it by itself when google see the access token is expired
            // it genearte the new access token using the refresh token 
            if (
                error.code === 401 ||
                error.status === 401 ||
                error.response?.status === 401
            ) {

                oauth2Client.setCredentials({
                    refresh_token: primaryAccountByProject.refresh_token
                });

                const { credentials } = await oauth2Client.refreshAccessToken();
                const newAccessToken = credentials.access_token;

                await gmailAccountService.updateAccessToken(primaryAccountByProject.id, newAccessToken);

                oauth2Client.setCredentials({
                    // access_token: newAccessToken,
                    refresh_token: primaryAccountByProject.refresh_token
                });

                const retryPeople = google.people({
                    version: "v1",
                    auth: oauth2Client
                });

                const retryResponse =
                    await retryPeople.people.createContact({
                        requestBody: {
                            names: [
                                {
                                    givenName: name,
                                    displayName: name
                                }
                            ],
                            phoneNumbers: [
                                {
                                    value: mobile
                                }
                            ]
                        }
                    });

            } else {
                throw error;
            }
        }

        await gmailAccountService
            .updateLastSavedNumber(
                connection,
                primaryAccountByProject.id,
                nextNumber
            );

        await connection.commit();

        return {
            contact_name: name,
            mobile_number: mobile,
            saved_in_email: primaryAccountByProject.gmail_id
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const contactService = {
    createContact
};