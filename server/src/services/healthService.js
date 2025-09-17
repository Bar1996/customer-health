import { pool } from "../config/db.js";

export async function calculateHealthScore(customerId) {
  const { rows: events } = await pool.query(
    `SELECT event_type, event_value, event_date
     FROM events
     WHERE customer_id = $1`,
    [customerId]
  );

  if (!events.length) {
    return {
      score: 0,
      factors: {
        logins: 0,
        features: 0,
        apiCalls: 0,
        tickets: 0,
        lateInvoices: 0,
      },
    };
  }

  const now = new Date();
  const daysAgo = (d) => (now - new Date(d)) / 86400000;

  // חלונות זמן
  const last30 = events.filter((e) => daysAgo(e.event_date) <= 30);
  const last90 = events.filter((e) => daysAgo(e.event_date) <= 90);

  // ספירות/סכומים עקביים לשמות האירועים מה-UI
  const logins = last30.filter((e) => e.event_type === "login").length;
  const features = last30.filter((e) => e.event_type === "feature").length;
  const apiCalls = last30
    .filter((e) => e.event_type === "api_call")
    .reduce((s, e) => s + (e.event_value ?? 1), 0);
  const tickets = last30.filter((e) => e.event_type === "ticket").length;
  const lateInvoices = last90.filter(
    (e) => e.event_type === "late_invoice"
  ).length; // איחורים רלוונטיים גם ברבעון

  // נרמול לרמות "תקרה" ריאליות
  // (תוכל לכוון את המספרים לפי הדאטה שלך)
  const loginScore = Math.min(logins / 12, 1) * 25; // 12+ לוגינים ב-30 יום = 25 נק'
  const featureScore = Math.min(features / 8, 1) * 25; // 8+ שימושי פיצ'רים = 25 נק'
  const apiScore = Math.min(apiCalls / 100, 1) * 20; // 100+ קריאות API = 20 נק'
  const ticketScore = (1 - Math.min(tickets / 6, 1)) * 20; // יותר מדי טיקטים מוריד
  const invoiceScore = (1 - Math.min(lateInvoices / 2, 1)) * 10; // איחור 1-2 יוריד בהתאם

  let score = Math.round(
    loginScore + featureScore + apiScore + ticketScore + invoiceScore
  );
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    factors: { logins, features, apiCalls, tickets, lateInvoices },
  };
}

export async function addEvent(customerId, eventType, eventValue, eventDate) {
  const { rows } = await pool.query(
    `INSERT INTO events (customer_id, event_type, event_value, event_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
    [customerId, eventType, eventValue ?? 1, eventDate ?? new Date()]
  );
  return rows[0];
}
