import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await db.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const setResetToken = async (email, token, expires) => {
    const query = `
        UPDATE users
        SET reset_token = $1, reset_token_expires = $2
        WHERE email = $3
        RETURNING user_id;
    `;
    const result = await db.query(query, [token, expires, email]);
    return result.rows.length > 0 ? result.rows[0].user_id : null;
};

const getUserByResetToken = async (token) => {
    const query = `
        SELECT * FROM users
        WHERE reset_token = $1 AND reset_token_expires > NOW();
    `;
    const result = await db.query(query, [token]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const updatePassword = async (userId, passwordHash) => {
    const query = `
        UPDATE users
        SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
        WHERE user_id = $2
        RETURNING user_id;
    `;
    const result = await db.query(query, [passwordHash, userId]);
    return result.rows.length > 0 ? result.rows[0].user_id : null;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
        return null;
    }

    // Remove the password hash before returning the user
    delete user.password_hash;
    return user;
};

/**
 * Retrieves all registered users along with their role name.
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name;
    `;
    const result = await db.query(query);
    return result.rows;
};

export { createUser, getUserByEmail, setResetToken, getUserByResetToken, updatePassword, authenticateUser, getAllUsers };