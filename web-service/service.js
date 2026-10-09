const express = require('express');
const dns = require('dns');
const app = express();

app.get('/validate', (req, res) => {
    const email = req.query.email;
    
    // 1. Проверка регулярным выражением
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.json({ validFormat: false, mxFound: false, error: "Invalid format" });
    }

    // 2. Извлечение домена и проверка MX записей
    const domain = email.split('@')[1];
    dns.resolveMx(domain, (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
            return res.json({ validFormat: true, mxFound: false });
        }
        
        // Сортируем записи по приоритету
        addresses.sort((a, b) => a.priority - b.priority);
        res.json({ validFormat: true, mxFound: true, mxRecords: addresses });
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Web-service (Email Validator) running on port ${PORT}`));
