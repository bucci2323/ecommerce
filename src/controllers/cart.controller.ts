import { Request, Response } from 'express';
import { Cart, CartItem } from '../models';

export const createCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Error creating cart' });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.params.id },
      include: [CartItem]
    });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

export const addCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await CartItem.create({
      ...req.body,
      cartId: req.params.cartId
    });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: 'Error adding item to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const [updated] = await CartItem.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await CartItem.findByPk(req.params.id);
      res.json(updatedItem);
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating cart item' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const deleted = await CartItem.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error removing item from cart' });
  }
}; 