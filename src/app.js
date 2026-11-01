const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRouter = require('./routes/health');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/health/db', healthRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;