import { pool } from "../config/db.js";
import { calculateHealthScore, addEvent } from "../services/healthService.js";

describe("healthService", () => {
  let testCustomerId;

  beforeAll(async () => {
    const { rows } = await pool.query(
      "INSERT INTO customers (name, segment) VALUES ($1, $2) RETURNING id",
      ["Test Customer", "startup"]
    );
    testCustomerId = rows[0].id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM customers WHERE id = $1", [testCustomerId]);
    await pool.end();
  });

  it("calculates score for customer with no events", async () => {
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(score).toBe(0);
    expect(factors.logins).toBe(0);
  });

  it("increases score with logins", async () => {
    await addEvent(testCustomerId, "login", 1, new Date());
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(factors.logins).toBeGreaterThan(0);
    expect(score).toBeGreaterThan(0);
  });

  it("increases score with feature usage", async () => {
    await addEvent(testCustomerId, "feature_usage", 1, new Date());
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(factors.features).toBeGreaterThan(0);
    expect(score).toBeGreaterThan(0);
  });

  it("increases score with api calls", async () => {
    await addEvent(testCustomerId, "api_call", 5, new Date());
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(factors.apiCalls).toBeGreaterThan(0);
    expect(score).toBeGreaterThan(0);
  });

  it("reduces score with support tickets", async () => {
    await addEvent(testCustomerId, "support_ticket", 1, new Date());
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(factors.tickets).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it("reduces score with late invoices", async () => {
    await addEvent(testCustomerId, "invoice_late", 1, new Date());
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(factors.lateInvoices).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });
});
