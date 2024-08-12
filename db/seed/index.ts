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
  id: string;
  user_id: string;
  total: number;
}

interface Product {
  cart_id: string;
  sku: string;
  quantity: number;
  price: number;
}

const generateCarts = (count: number): Cart[] => {
  const carts: Cart[] = [];
  for (let i = 0; i < count; i++) {
    carts.push(generateCart());
  }
  return carts;
};

const generateProductsInCart = (count: number, cart_id: string): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    products.push(generateProduct(cart_id));
  }
  return products;
};

const generateProduct = (cart_id: string): Product => {
  return {
    cart_id,
    sku: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    price: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
  };
};

const generateCart = (): Cart => {
  return {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    total: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
  };
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
    const carts = generateCarts(10);

    const products: Product[] = [];

    carts.forEach((cart: Cart) => {
      products.push(...generateProductsInCart(3, cart.id));
    });

    await seedTable("carts", carts);
    await seedTable("products", products);

    console.log("Seeding completed successfully");
  } catch (err) {
    console.error("Error seeding data", err);
  } finally {
    await pool.end();
  }
};

seedData();
