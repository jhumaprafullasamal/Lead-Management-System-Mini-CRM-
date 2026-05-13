const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'lead_crm',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    console.log('🔄 Initializing database components...');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(100) NOT NULL,
        email         VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT         NOT NULL,
        created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Users table ready');

    // 2. Leads Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100)  NOT NULL,
        phone       VARCHAR(20)   NOT NULL,
        source      VARCHAR(20)   NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
        status      VARCHAR(20)   NOT NULL DEFAULT 'New'
                                  CHECK (status IN ('New', 'Interested', 'Not Interested', 'Converted')),
        notes       TEXT,
        created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ Leads table ready');

    // 3. Migration: Add user_id column
    // We use a try-catch for the column addition to handle older Postgres versions
    try {
      await client.query('ALTER TABLE leads ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE');
      console.log('✅ Added user_id column to leads');
    } catch (err) {
      if (err.code === '42701') { // 42701 is "duplicate_column" in Postgres
        console.log('ℹ️ user_id column already exists, skipping migration');
      } else {
        throw err;
      }
    }

    // 4. Triggers and Indexes
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
      CREATE TRIGGER update_leads_updated_at
        BEFORE UPDATE ON leads
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      CREATE INDEX IF NOT EXISTS idx_users_email   ON users(email);
      CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_source  ON leads(source);
      CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
    `);
    console.log('✅ Triggers and indexes ready');

    console.log('🚀 Database initialization complete!');
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    console.error('Stack:', err.stack);
  } finally {
    client.release();
  }
};

initDB();

module.exports = pool;
