import { faker } from "@faker-js/faker";
import { pool } from "./config/db.js";

const segments = ["enterprise", "SMB", "startup"];
const eventTypes = ["login", "feature", "api_call", "ticket", "late_invoice"];

function randomDateInLastNDays(n) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * n));
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function seed() {
  console.log("Seeding customers...");
  const customers = [];
  for (let i = 0; i < 50; i++) {
    const name = faker.company.name();
    const segment = segments[Math.floor(Math.random() * segments.length)];
    const { rows } = await pool.query(
      "INSERT INTO customers (name, segment) VALUES ($1, $2) RETURNING id",
      [name, segment]
    );
    customers.push(rows[0].id);
  }

  console.log("Seeding events (≈ 90 days)...");
  for (const cid of customers) {
    const eventsCount = 200 + Math.floor(Math.random() * 200); // 200-400 אירועים
    for (let i = 0; i < eventsCount; i++) {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const value = type === "api_call" ? 1 + Math.floor(Math.random() * 5) : 1;
      const date = randomDateInLastNDays(90);
      await pool.query(
        "INSERT INTO events (customer_id, event_type, event_value, event_date) VALUES ($1,$2,$3,$4)",
        [cid, type, value, date]
      );
    }
  }

  console.log("✅ Done seeding.");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
