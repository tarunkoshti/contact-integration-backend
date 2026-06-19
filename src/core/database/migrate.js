import pool from "../../config/db.js";
import Logger from "../utils/logger.js";

const migrate = async () => {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS gmail_accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                gmail_id VARCHAR(255) NOT NULL UNIQUE,
                access_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL,
                client_id VARCHAR(255) NOT NULL,
                client_secret VARCHAR(255) NOT NULL,
                primary_status TINYINT(1) DEFAULT 0,
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