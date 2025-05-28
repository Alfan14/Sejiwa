import dotenv from 'dotenv';
import pg from 'pg';

const Pool = pg.Pool

dotenv.config(); 

const poolConfig = {
  max: 5,
  min: 2,
  idleTimeoutMilis: 600000,
};

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST; 
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT ;

poolConfig.connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
const pool = new Pool(poolConfig)

export default pool;