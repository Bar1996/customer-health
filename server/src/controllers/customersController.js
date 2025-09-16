import { pool } from '../config/db.js';
import { calculateHealthScore, addEvent } from '../services/healthService.js';


export async function getAllCustomers(req, res, next) {
  try {
    console.log("enter here")
    const { rows } = await pool.query(
      'SELECT id, name, segment, created_at FROM customers ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function getCustomerHealth(req, res, next) {
    try {
      const customerId = req.params.id;
  
      // נבדוק שהלקוח קיים
      const { rows } = await pool.query('SELECT * FROM customers WHERE id = $1', [customerId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      const result = await calculateHealthScore(customerId);
      res.json({
        customer: rows[0],
        health: result,
      });
    } catch (err) {
      next(err);
    }
  }

  export async function createEvent(req, res, next) {
  try {
    const customerId = req.params.id;
    const { event_type, event_value, event_date } = req.body;

    if (!event_type) {
      return res.status(400).json({ error: 'event_type is required' });
    }

    const { rows } = await pool.query('SELECT id FROM customers WHERE id = $1', [customerId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const event = await addEvent(customerId, event_type, event_value, event_date);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}
