const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_NAME || 'labdb',
    password: process.env.DB_PASSWORD || 'postgres',
    port: 5432,
});

// Init connection check
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Получить список проверенных email из БД
app.get('/api/emails', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM verified_emails ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Проверить новый email через Web-service и сохранить в БД
app.post('/api/verify', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        // Запрос к изолированному Web-сервису
        const wsResponse = await axios.get(`http://web-service:3001/validate?email=${encodeURIComponent(email)}`);
        const data = wsResponse.data;
        
        const isValid = data.validFormat && data.mxFound;
        const mxRecords = data.mxRecords ? JSON.stringify(data.mxRecords) : null;

        const insert = await pool.query(
            'INSERT INTO verified_emails (email, is_valid, mx_records) VALUES ($1, $2, $3) RETURNING *',
            [email, isValid, mxRecords]
        );
        res.json(insert.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});
