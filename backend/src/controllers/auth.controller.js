const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/user.dao');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userDao.findByEmail(email);
        if (!user) {
            // Auto-register for this demo/setup if user doesn't exist
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await userDao.createUser({
                email,
                password: hashedPassword,
                name: email.split('@')[0]
            });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
