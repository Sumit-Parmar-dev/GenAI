const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/user.dao');

// Register a new user
exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await userDao.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userDao.createUser({
            email,
            password: hashedPassword,
            name: name || email.split('@')[0]
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ message: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userDao.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Logout (mostly frontend cleanup, but provided for completeness)
exports.logout = async (req, res) => {
    // In JWT setup, logout is typically handled by the client removing the token.
    // However, we can provide a success response.
    res.json({ message: 'Logged out successfully' });
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userDao.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userDao.updatePassword(email, hashedPassword);

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

