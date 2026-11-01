const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

async function register(req, res, next) {
    try {
        const { name, email, password, role, teacherCode } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!email || !EMAIL_RE.test(email)) {
            return res.status(400).json({ error: 'A valid email is required' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'Password must atleast be 8 characters long' });
        }

        let userRole = 'learner';
        if (role === 'teacher') {
            const expected = process.env.TEACHER_SIGNUP_CODE;
            if (!expected || teacherCode !== expected) {
                return res.status(403).json({ error: 'Invalid teacher code' });
            }
            userRole = 'teacher';
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role`,
            [name.trim(), email.toLowerCase(), passwordHash, userRole]
        );

        const user = result.rows[0];
        res.status(201).json({ user, token: signToken(user) });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already registered' });
        }
        next(err);
    }
}

async function login(req, res, next) {

}