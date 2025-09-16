import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db.js';
import { initSchema } from './db/schema.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/healthz', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await testConnection();
  await initSchema();
});
