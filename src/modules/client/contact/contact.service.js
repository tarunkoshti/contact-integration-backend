import { google } from "googleapis";
import { gmailAccountService } from "../../admin/gmail-account/gmail-account.service.js";
import oauth2Client from "../../../config/google.js";
import { ApiError } from "../../../core/utils/ApiError.js";

const createContact = async ({ name, mobile }) => {

    const primaryAccount = await gmailAccountService.getPrimaryAccount();

    if (!primaryAccount) {
        throw new ApiError(
            404,
            "No primary Gmail account found"
        );
    }

    oauth2Client.setCredentials({
        access_token: primaryAccount.access_token,
        refresh_token: primaryAccount.refresh_token
    });

    const people = google.people({
        version: "v1",
        auth: oauth2Client
    });

    try {
        const response =
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
                            value: mobile
                        }
                    ]
                }
            });

        return response.data;

    } catch (error) {

        // we don't need it because google handle it by itself when google see the access token is expired
        // it genearte the new access token using the refresh token 
        if (
            error.code === 401 ||
            error.status === 401 ||
            error.response?.status === 401
        ) {

            oauth2Client.setCredentials({
                refresh_token: primaryAccount.refresh_token
            });

            const { credentials } = await oauth2Client.refreshAccessToken();
            const newAccessToken = credentials.access_token;

            await gmailAccountService.updateAccessToken(primaryAccount.id, newAccessToken);

            oauth2Client.setCredentials({
                access_token: newAccessToken,
                refresh_token: primaryAccount.refresh_token
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

            return retryResponse.data;
        }

        throw error;
    }
};

export const contactService = {
    createContact
};