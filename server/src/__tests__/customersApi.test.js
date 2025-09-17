import request from "supertest";
import app from "../app.js";
import { pool } from "../config/db.js";

describe("Customers API", () => {
  let customerId;

  beforeAll(async () => {
    const { rows } = await pool.query(
      `INSERT INTO customers (name, segment)
       VALUES ('API Test Customer', 'test')
       RETURNING id`
    );
    customerId = rows[0].id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM customers WHERE id = $1", [customerId]);
    // ⚠️ לא עושים pool.end() פה, כדי לא להרוס טסטים אחרים
  });

  it("GET /api/customers returns list of customers", async () => {
    const res = await request(app).get("/api/customers");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("health_score");
  });

  it("GET /api/customers/:id/health returns health breakdown", async () => {
    const res = await request(app).get(`/api/customers/${customerId}/health`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("health");
    expect(res.body.health).toHaveProperty("score");
  });

  it("POST /api/customers/:id/events creates new event", async () => {
    const res = await request(app)
      .post(`/api/customers/${customerId}/events`)
      .send({
        event_type: "login",
        event_date: new Date().toISOString().slice(0, 10),
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.event_type).toBe("login");
  });

  it("GET /api/customers/:id/health returns 404 for non-existing customer", async () => {
    const res = await request(app).get("/api/customers/9999999/health");
    expect(res.status).toBe(404);
  });
});

// ⚠️ pool.end() רק פעם אחת, בקובץ נפרד או בסיום כל הטסטים
afterAll(async () => {
  await pool.end();
});
