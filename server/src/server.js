import app from "./app.js";
import { pool, testConnection } from "./config/db.js"; // 👈 הוספתי pool
import { initSchema } from "./db/schema.js";
import { runSeed } from "./seed.js";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const { rows } = await pool.query("SELECT COUNT(*) FROM customers");
  if (parseInt(rows[0].count) === 0) {
    console.log("⚠️ No customers found. Running seed...");
    await runSeed();
  } else {
    console.log(`✅ Found ${rows[0].count} customers. Skipping seed.`);
  }
}

(async () => {
  try {
    await testConnection();
    await initSchema();
    await bootstrap();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
