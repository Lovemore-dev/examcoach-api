const express = require('express');
const pool = require('..//config/db');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

router.get('/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS time');
        res.json({ status: 'ok', time: result.rows[0].time });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database unreachable' });
    }
});

module.exports = router;