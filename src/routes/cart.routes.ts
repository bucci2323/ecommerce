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


router.use(authenticate);


router.post('/', createCart as RequestHandler);


router.get('/', getCart as RequestHandler);


router.post('/items', addCartItem as RequestHandler);


router.put('/items/:id', updateCartItem as RequestHandler);


router.delete('/items/:id', deleteCartItem as RequestHandler);

export default router; 