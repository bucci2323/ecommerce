import express from 'express';
import { RequestHandler } from '../types/express';
import { createCart, getCart, addCartItem, updateCartItem, deleteCartItem } from '../controllers/cart.controller';

const router = express.Router();

// Create a new cart
router.post('/', (async (req, res) => {
  await createCart(req, res);
}) as RequestHandler);

// Get user's cart
router.get('/:id', (async (req, res) => {
  await getCart(req, res);
}) as RequestHandler);

// Add item to cart
router.post('/:cartId/items', (async (req, res) => {
  await addCartItem(req, res);
}) as RequestHandler);

// Update cart item quantity
router.put('/items/:id', (async (req, res) => {
  await updateCartItem(req, res);
}) as RequestHandler);

// Remove item from cart
router.delete('/items/:id', (async (req, res) => {
  await deleteCartItem(req, res);
}) as RequestHandler);

export default router; 