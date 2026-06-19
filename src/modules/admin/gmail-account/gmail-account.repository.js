import pool from "../../../config/db.js";

const findByEmail = async (email) => {
    const [rows] = await pool.query(
        `
        SELECT *
        FROM gmail_accounts
        WHERE gmail_id = ?
        `,
        [email]
    );

    return rows[0] || null;
};

const getPrimaryCount = async () => {
    const [rows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM gmail_accounts
        WHERE primary_status = 1
        `
    );

    return rows[0].total;
};

const createAccount = async (payload) => {
    const [result] = await pool.query(
        `
        INSERT INTO gmail_accounts
        (
            gmail_id,
            access_token,
            refresh_token,
            client_id,
            client_secret,
            primary_status
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            payload.gmail_id,
            payload.access_token,
            payload.refresh_token,
            payload.client_id,
            payload.client_secret,
            payload.primary_status
        ]
    );

    return result;
};

const getAllAccounts = async () => {
    const [rows] = await pool.query(
        `
        SELECT
            id,
            gmail_id,
            primary_status,
            created_at
        FROM gmail_accounts
        ORDER BY created_at DESC
        `
    );

    return rows;
};

const removePrimaryAccount = async (connection) => {
    await connection.query(
        `
        UPDATE gmail_accounts
        SET primary_status = 0
        WHERE primary_status = 1
        `
    );
};

const setPrimaryAccount = async (connection, id) => {

    await connection.query(
        `
        UPDATE gmail_accounts
        SET primary_status = 1
        WHERE id = ?
        `,
        [id]
    );
};

const findById = async (id) => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM gmail_accounts
        WHERE id = ?
        `,
        [id]
    );

    return rows[0] || null;
};

const getPrimaryAccount = async () => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM gmail_accounts
        WHERE primary_status = 1
        `
    );

    return rows[0] || null;
};

const updateAccessToken = async (
    id,
    accessToken
) => {

    await pool.query(
        `
        UPDATE gmail_accounts
        SET access_token = ?
        WHERE id = ?
        `,
        [
            accessToken,
            id
        ]
    );
};

export const gmailAccountRepository = {
    findByEmail,
    getPrimaryCount,
    createAccount,
    getAllAccounts,
    removePrimaryAccount,
    setPrimaryAccount,
    findById,
    getPrimaryAccount,
    updateAccessToken
};