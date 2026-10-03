import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createUser, getUserByEmail, setResetToken, getUserByResetToken, updatePassword, authenticateUser, getAllUsers } from '../models/users.js';
import { sendResetEmail } from '../utils/email.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userId = await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showForgotPasswordForm = (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' });
};

const processForgotPasswordForm = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await getUserByEmail(email);

        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expires = new Date(Date.now() + 60 * 60 * 1000);

            await setResetToken(email, token, expires);

            const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
            await sendResetEmail(email, resetLink);
        }

        req.flash('success', 'If that email is registered, a reset link has been sent.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/forgot-password');
    }
};

const showResetPasswordForm = async (req, res) => {
    const { token } = req.params;

    const user = await getUserByResetToken(token);

    if (!user) {
        req.flash('error', 'This password reset link is invalid or has expired.');
        return res.redirect('/forgot-password');
    }

    res.render('reset-password', { title: 'Reset Password', token });
};

const processResetPasswordForm = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await getUserByResetToken(token);

        if (!user) {
            req.flash('error', 'This password reset link is invalid or has expired.');
            return res.redirect('/forgot-password');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await updatePassword(user.user_id, passwordHash);

        req.flash('success', 'Your password has been reset. Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error resetting password:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect(`/reset-password/${token}`);
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

/**
 * Middleware factory to require specific role for route access
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        next();
    };
};

// Handles GET /users — admin-only page listing all registered users
const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showForgotPasswordForm,
    processForgotPasswordForm,
    showResetPasswordForm,
    processResetPasswordForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};