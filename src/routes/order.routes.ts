import express from 'express';
import { RequestHandler } from '../types/express';
import { createOrder, getOrders, getOrder, updateOrder, deleteOrder } from '../controllers/order.controller';

const router = express.Router();

// Create a new order
router.post('/', (async (req, res) => {
  await createOrder(req, res);
}) as RequestHandler);

// Get all orders
router.get('/', (async (req, res) => {
  await getOrders(req, res);
}) as RequestHandler);

// Get a single order
router.get('/:id', (async (req, res) => {
  await getOrder(req, res);
}) as RequestHandler);

// Update order
router.put('/:id', (async (req, res) => {
  await updateOrder(req, res);
}) as RequestHandler);

// Delete  order
router.delete('/:id', (async (req, res) => {
  await deleteOrder(req, res);
}) as RequestHandler);

export default router; 