import dotenv from 'dotenv';
import pg from 'pg';

const Pool = pg.Pool

dotenv.config(); 

const USER = process.env.DB_USER ;
const HOST = process.env.DB_HOST ; 
const DB = process.env.DB_NAME;
const PASSWORD = process.env.DB_PASSWORD;
const PORT = process.env.DB_PORT ;

const pool = new Pool({
  user: USER,
  host: HOST,
  database: DB,
  password: PASSWORD,
  port: PORT,
})

export default pool;