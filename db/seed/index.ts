import "dotenv/config";

import { faker } from "@faker-js/faker";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "postgres",
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!, 10),
});

interface Cart {
  user_id: string;
  total: number;
}

const generateCarts = (count: number): Cart[] => {
  const carts: Cart[] = [];
  for (let i = 0; i < count; i++) {
    carts.push({
      user_id: faker.string.uuid(),
      total: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
    });
  }
  return carts;
};

const seedTable = async (tableName: string, data: Object[]) => {
  const client = await pool.connect();

  try {
    for (const item of data) {
      const columns = Object.keys(item).join(", ");
      const values = Object.values(item);
      const placeholders = values
        .map((_, index) => {
          return `$${index + 1}`;
        })
        .join(", ");

      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      await client.query(query, values);
    }
    console.log(`Seeded ${tableName} table successfully.`);
  } catch (err) {
    console.error(`Error seeding ${tableName}:`, err);
  } finally {
    client.release();
  }
};

const seedData = async () => {
  try {
    const users = generateCarts(10);

    await seedTable("carts", users);

    console.log("Seeding completed successfully");
  } catch (err) {
    console.error("Error seeding data", err);
  } finally {
    await pool.end();
  }
};

seedData();
