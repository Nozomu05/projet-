const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'waifudb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS waifus (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100)   NOT NULL,
      anime       VARCHAR(150)   NOT NULL,
      description TEXT,
      image_url   TEXT,
      hair_color  VARCHAR(50),
      personality TEXT,
      rating      DECIMAL(3,1)   DEFAULT 0,
      created_at  TIMESTAMP      DEFAULT NOW()
    )
  `);

  const { rows } = await pool.query('SELECT COUNT(*) FROM waifus');
  if (parseInt(rows[0].count) === 0) {
    const { seedWaifus } = require('./seed');
    await seedWaifus(pool);
    console.log('Database seeded with initial waifu data');
  }
};

module.exports = { pool, initDB };
