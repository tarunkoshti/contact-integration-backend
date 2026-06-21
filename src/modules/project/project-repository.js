import pool from "../../config/db.js";

const createProject = async ({ projectName }) => {
    const [result] = await pool.query(
        `
        INSERT INTO projects
        (project_name)
        VALUES (LOWER(?))
        `,
        [projectName]
    );

    return result;
};

const getAllProjects = async () => {
    const [rows] = await pool.query(
        `
        SELECT *
        FROM projects
        ORDER BY id DESC
        `
    );

    return rows;
};

const getProjectById = async (id) => {
    const [rows] = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};

export const projectRepository = {
    createProject,
    getAllProjects,
    getProjectById
};