import express from 'express';
import cors from 'cors';
import { testConnection } from './config/db.js';
import { initSchema } from './db/schema.js';
import customersRouter from './routes/customers.js';

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get('/api/healthz', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/customers', customersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await testConnection();
  await initSchema();
});
