import pool from "../../config/db.js";

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

const getPrimaryCountByProject = async (projectId) => {
    const [rows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM gmail_accounts
        WHERE primary_status = 1
        AND project_id = ?
        `,
        [projectId]
    );

    return rows[0].total;
};

const createAccount = async (payload) => {
    console.log(payload)
    const [result] = await pool.query(
        `
        INSERT INTO gmail_accounts
        (
            project_id,
            gmail_id,
            refresh_token,
            primary_status,
            last_saved_number
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            Number(payload.project_id),
            payload.gmail_id,
            payload.refresh_token,
            payload.primary_status,
            0
        ]
    );

    return result;
};

const getAllAccounts = async () => {
    const [rows] = await pool.query(
        `
        SELECT
            ga.id,
            ga.gmail_id,
            ga.primary_status,
            ga.last_saved_number,
            ga.created_at,
            p.id AS project_id,
            p.project_name
        FROM gmail_accounts ga
        INNER JOIN projects p
            ON ga.project_id = p.id
        ORDER BY ga.created_at DESC
        `
    );

    return rows;
};

const removePrimaryAccountByProject = async (connection, projectId) => {
    await connection.query(
        `
        UPDATE gmail_accounts
        SET primary_status = 0
        WHERE primary_status = 1
        AND project_id = ?
        `,
        [projectId]
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

const getPrimaryAccountByProjectForUpdate = async (connection, projectId) => {

    const [rows] = await connection.query(
        `
        SELECT *
        FROM gmail_accounts
        WHERE project_id = ?
        AND primary_status = 1
        LIMIT 1
        FOR UPDATE
        `,
        [projectId]
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

const updateLastSavedNumber = async (
    connection,
    gmailAccountId,
    lastSavedNumber
) => {

    await connection.query(
        `
        UPDATE gmail_accounts
        SET last_saved_number = ?
        WHERE id = ?
        `,
        [
            lastSavedNumber,
            gmailAccountId
        ]
    );
};

export const gmailAccountRepository = {
    findByEmail,
    getPrimaryCountByProject,
    createAccount,
    getAllAccounts,
    removePrimaryAccountByProject,
    setPrimaryAccount,
    findById,
    getPrimaryAccountByProjectForUpdate,
    updateAccessToken,
    updateLastSavedNumber
};