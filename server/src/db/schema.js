import { pool } from '../config/db.js';

export async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      segment VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      event_type VARCHAR(50) NOT NULL,   -- login / feature_usage / support_ticket / invoice / api_call
      event_value INT DEFAULT 1,
      event_date DATE NOT NULL
    );
  `);

  console.log("✅ Schema initialized");
}
