import { google as googleApis } from "googleapis";
import { google as googleConfig } from './base.js';

const oauth2Client = new googleApis.auth.OAuth2(
    googleConfig.client_id,
    googleConfig.client_secret,
    googleConfig.redirect_uri
);

export default oauth2Client;