import app from "./app.js";
import { testConnection } from "./config/db.js";
import { initSchema } from "./db/schema.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await testConnection();
    await initSchema();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
