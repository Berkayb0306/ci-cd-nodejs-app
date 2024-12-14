const mysql = require('mysql2/promise');

// Veritabanı bağlantı havuzu ayarları
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Ortam değişkeninden al, yoksa localhost
  user: process.env.DB_USER || 'berkay_soy19@hotmail.com', // Ortam değişkeninden al, yoksa default kullanıcı adı
  password: process.env.DB_PASSWORD || 'Berkay_1999', // Ortam değişkeninden al, yoksa default şifre
  database: process.env.DB_NAME || 'mydb', // Ortam değişkeninden al, yoksa mydb
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
