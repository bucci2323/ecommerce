import { Router } from 'express';
import { RequestHandler } from '../types/express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createCart,
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem
} from '../controllers/cart.controller';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

// Create a new cart
router.post('/', createCart as RequestHandler);

// Get user's cart
router.get('/', getCart as RequestHandler);

// Add item to cart
router.post('/items', addCartItem as RequestHandler);

// Update cart item quantity
router.put('/items/:id', updateCartItem as RequestHandler);

// Remove item from cart
router.delete('/items/:id', deleteCartItem as RequestHandler);

export default router; 