import request from "supertest";
import app from "../app.js";
import { pool } from "../config/db.js";

describe("Customers API", () => {
  afterAll(async () => {
    await pool.end();
  });

  it("GET /api/customers returns list of customers", async () => {
    const res = await request(app).get("/api/customers");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("segment");
      expect(res.body[0]).toHaveProperty("created_at");
    }
  });

  it("GET /api/customers/:id/health returns health breakdown", async () => {
    const resAll = await request(app).get("/api/customers");
    const id = resAll.body[0].id;

    const res = await request(app).get(`/api/customers/${id}/health`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("health");
    expect(res.body.health).toHaveProperty("score");
    expect(res.body.health).toHaveProperty("factors");
    expect(typeof res.body.health.score).toBe("number");
  });

  it("POST /api/customers/:id/events adds an event", async () => {
    const resAll = await request(app).get("/api/customers");
    const id = resAll.body[0].id;

    const res = await request(app)
      .post(`/api/customers/${id}/events`)
      .send({ event_type: "login", event_value: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.customer_id).toBe(id);
    expect(res.body.event_type).toBe("login");
  });
});
