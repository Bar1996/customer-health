import { Router } from 'express';
import { getAllCustomers, getCustomerHealth, createEvent } from '../controllers/customersController.js';

const router = Router();

router.get('/', getAllCustomers);
router.get('/:id/health', getCustomerHealth);
router.post('/:id/events', createEvent);

export default router;
