// seed.js
import { faker } from "@faker-js/faker";
import { pool } from "./config/db.js";

const segments = ["enterprise", "SMB", "startup"];
const eventTypes = [
  "login",
  "feature_usage",
  "api_call",
  "support_ticket",
  "invoice_late",
];

function randomDateInLastNDays(n) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * n));
  return d.toISOString().slice(0, 10);
}

export async function runSeed() {
  console.log("🌱 Running seed...");
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

  const third = Math.floor(customers.length / 3);

  for (let i = 0; i < customers.length; i++) {
    const cid = customers[i];
    let profile;

    if (i < third) profile = "low"; // 0–50
    else if (i < third * 2) profile = "mid"; // 50–80
    else profile = "high"; // 80–100

    const eventsCount = 200 + Math.floor(Math.random() * 200);

    for (let j = 0; j < eventsCount; j++) {
      let type;

      if (profile === "low") {
        // לקוחות בסיכון → הרבה בעיות
        if (Math.random() < 0.5) type = "support_ticket";
        else if (Math.random() < 0.9) type = "invoice_late";
        else type = "login";
      } else if (profile === "mid") {
        // לקוחות בינוניים → תמהיל מגוון
        const r = Math.random();
        if (r < 0.3) type = "login";
        else if (r < 0.55) type = "feature_usage";
        else if (r < 0.7) type = "api_call";
        else if (r < 0.85) type = "support_ticket";
        else type = "invoice_late";
      } else {
        const r = Math.random();
        if (r < 0.5) type = "login";
        else if (r < 0.9) type = "feature_usage";
        else type = "api_call";
      }

      const value = type === "api_call" ? 1 + Math.floor(Math.random() * 5) : 1;
      const date = randomDateInLastNDays(90);

      await pool.query(
        "INSERT INTO events (customer_id, event_type, event_value, event_date) VALUES ($1,$2,$3,$4)",
        [cid, type, value, date]
      );
    }
  }

  console.log("✅ Seed completed with ~⅓ low, ~⅓ mid, ~⅓ high profiles.");
}

if (process.argv[1].includes("seed.js")) {
  runSeed().then(() => process.exit(0));
}
