import pool from "../../config/db.js";
import Logger from "../utils/logger.js";

const migrate = async () => {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS gmail_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                gmail_id VARCHAR(255) NOT NULL UNIQUE,
                refresh_token TEXT NOT NULL,
                primary_status TINYINT(1) DEFAULT 0,
                last_saved_number INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        Logger.info("Migration completed");

        process.exit(0);

    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
};

migrate();