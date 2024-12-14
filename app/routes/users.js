const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // MySQL bağlantısı için gerekli modül

// Veritabanı bağlantısı oluşturma
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // DB_HOST ortam değişkeni kullanılıyor
  user: process.env.DB_USER || 'root', // DB_USER ortam değişkeni kullanılıyor
  password: process.env.DB_PASSWORD || '', // DB_PASSWORD ortam değişkeni kullanılıyor
  database: process.env.DB_NAME || 'mydb', // DB_NAME ortam değişkeni kullanılıyor
});

// Kullanıcıları listeleme route'u
router.get('/', async (req, res) => {
  try {
    // Veritabanından kullanıcıları çek
    const [rows] = await pool.execute('SELECT * FROM users');
    res.json(rows); // JSON olarak döndür
  } catch (error) {
    console.error(error); // Hata logla
    res.status(500).json({ message: 'Error fetching users' }); // Hata mesajı döndür
  }
});

module.exports = router;
