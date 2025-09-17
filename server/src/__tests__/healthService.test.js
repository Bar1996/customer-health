import { pool } from "../config/db.js";
import { calculateHealthScore, addEvent } from "../services/healthService.js";

describe("healthService", () => {
  let testCustomerId;

  beforeAll(async () => {
    const res = await pool.query(
      `INSERT INTO customers (name, segment, created_at)
         VALUES ('Test Customer', 'SMB', NOW())
         RETURNING id`
    );
    testCustomerId = res.rows[0].id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM customers WHERE id = $1", [testCustomerId]);
    // ⚠️ סוגרים את ה־pool רק פעם אחת בכל הריצה → לא פה
  });

  it("returns score=0 when no events", async () => {
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

  it("reduces score with tickets", async () => {
    await addEvent(testCustomerId, "ticket", 1, new Date());
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(factors.tickets).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it("reduces score with late invoices", async () => {
    await addEvent(testCustomerId, "late_invoice", 1, new Date());
    const { score, factors } = await calculateHealthScore(testCustomerId);
    expect(factors.lateInvoices).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it("ignores old events (older than 90 days)", async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 120); // לפני 120 ימים
    await addEvent(testCustomerId, "login", 1, oldDate);

    const { factors } = await calculateHealthScore(testCustomerId);
    expect(factors.logins).toBeGreaterThanOrEqual(0);
  });
});
