const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { Parser } = require('json2csv');

const app = express();
app.use(cors());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'booking_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'report-service' });
});

app.get('/download-csv', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        b.id AS booking_id,
        u.name AS user_name,
        u.email AS user_email,
        t.name AS table_name,
        t.type AS table_type,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.total_price,
        b.status
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN tables t ON b.table_id = t.id
      ORDER BY b.booking_date DESC, b.start_time DESC
    `);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No bookings found to export.' });
    }

    // Convert to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=booking_reports.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Failed to generate CSV:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Report service listening on port ${PORT}`);
});
