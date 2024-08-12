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

// Define interfaces for the data structures
interface Cart {
  user_id: string;
  total: number;
}

// Function to generate random carts
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
    const users = generateCarts(10); // Adjust the count as needed

    await seedTable("carts", users);

    console.log("Seeding completed successfully");
  } catch (err) {
    console.error("Error seeding data", err);
  } finally {
    await pool.end(); // Close the pool when done
  }
};

seedData();

/* interface User {
  name: string;
  email: string;
}

interface Project {
  title: string;
  description: string;
}

// Function to generate random users
const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
    });
  }
  return users;
};

// Function to generate random projects
const generateProjects = (count: number): Project[] => {
  const projects: Project[] = [];
  for (let i = 0; i < count; i++) {
    projects.push({
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
    });
  }
  return projects;
};

// Function to insert data into a table
const seedTable = async (tableName: string, data: any[]) => {
  const client = await pool.connect();

  try {
    for (const item of data) {
      const columns = Object.keys(item).join(', ');
      const values = Object.values(item);
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

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

// Main seeding function
const seedData = async () => {
  try {
    const users = generateUsers(10); // Adjust the count as needed
    const projects = generateProjects(5); // Adjust the count as needed

    await seedTable('users', users);
    await seedTable('projects', projects);

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Error seeding data', err);
  } finally {
    await pool.end(); // Close the pool when done
  }
};

seedData();*/
