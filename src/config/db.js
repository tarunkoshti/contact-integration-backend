// Create connection pool
import mysql from 'mysql2/promise';
import { db } from './base.js';

const pool = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.name,
});

export default pool;