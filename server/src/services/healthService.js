import { pool } from '../config/db.js';

export async function calculateHealthScore(customerId) {
  // נמשוך את האירועים של הלקוח
  const { rows: events } = await pool.query(
    `SELECT event_type, event_value, event_date
     FROM events
     WHERE customer_id = $1`,
    [customerId]
  );

  if (events.length === 0) {
    return { score: 0, factors: { message: 'No events found' } };
  }

  // נחשב גורמים בסיסיים
  const now = new Date();
  const last30Days = events.filter(
    (e) => (now - new Date(e.event_date)) / (1000 * 60 * 60 * 24) <= 30
  );

  const logins = last30Days.filter((e) => e.event_type === 'login').length;
  const features = last30Days.filter((e) => e.event_type === 'feature_usage').length;
  const apiCalls = last30Days
    .filter((e) => e.event_type === 'api_call')
    .reduce((sum, e) => sum + e.event_value, 0);
  const tickets = last30Days.filter((e) => e.event_type === 'support_ticket').length;
  const lateInvoices = last30Days.filter((e) => e.event_type === 'invoice_late').length;

  // נוסחה פשוטה לניקוד (0-100)
  let score = 50;
  score += logins * 2;
  score += features * 3;
  score += Math.min(apiCalls, 50) * 1;
  score -= tickets * 5;
  score -= lateInvoices * 10;

  // נוודא שהציון בטווח 0–100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    factors: {
      logins,
      features,
      apiCalls,
      tickets,
      lateInvoices,
    },
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
  
