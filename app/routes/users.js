const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'Berkay_1999',
  database: process.env.DB_NAME || 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Debug route to verify router is loaded
router.get('/ping', (req, res) => {
  res.json({ message: 'Users router is working' });
});

// Test database connection
router.get('/test', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as test');
    connection.release();
    
    console.log('Database connection test successful');
    res.json({
      status: 'success',
      message: 'Database connection successful',
      test: rows[0].test
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    console.log('GET /users - Fetching all users');
    const [rows] = await pool.query('SELECT * FROM users');
    console.log('Fetched users:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ message: "Kullanıcı getirilirken bir hata oluştu" });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    console.log('POST /users - Creating new user');
    console.log('Request body:', req.body);

    const { name, email } = req.body;

    if (!name || !email) {
      console.log('Validation failed - missing name or email');
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Name and email are required',
        received: req.body
      });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    console.log('User created successfully:', result);
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, req.params.id]
    );
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Güncellenecek kullanıcı bulunamadı" });
    }
    
    res.json({ message: "Kullanıcı başarıyla güncellendi", id: req.params.id });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Kullanıcı güncellenirken bir hata oluştu" });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Silinecek kullanıcı bulunamadı" });
    }
    
    res.json({ message: "Kullanıcı başarıyla silindi", id: req.params.id });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu" });
  }
});

module.exports = router;