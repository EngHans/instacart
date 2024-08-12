import { Pool } from "pg";

const postgreSQL = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "postgres",
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!, 10),
});

export default postgreSQL;
