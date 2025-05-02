import { Request, Response } from 'express';
import { Cart, CartItem, Product } from '../models';

export const createCart = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const existingCart = await Cart.findOne({
      where: { userId: req.user.id }
    });

    if (existingCart) {
      return res.status(400).json({ error: 'User already has a cart' });
    }

    const cart = await Cart.create({
      userId: req.user.id
    });


    const createdCart = await Cart.findByPk(cart.id);
    
    if (!createdCart) {
      return res.status(500).json({ 
        error: 'Failed to create cart',
        details: 'Cart was not properly created'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Cart created successfully',
      cart: createdCart
    });
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ 
      error: 'Error creating cart',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user?.id },
      include: [{
        model: CartItem,
        as: 'cartItems',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ 
      error: 'Error fetching cart',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const addCartItem = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { productId, quantity } = req.body;


    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }


    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }


    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    let cart = await Cart.findOne({
      where: { userId: req.user.id }
    });

    if (!cart) {
      try {
        cart = await Cart.create({
          userId: req.user.id
        });
        console.log('New cart created:', cart.id);
      } catch (error) {
        console.error('Error creating cart:', error);
        return res.status(500).json({ 
          error: 'Error creating cart',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }


    if (!cart) {
      console.error('Cart is null after creation attempt');
      return res.status(500).json({ 
        error: 'Failed to create cart',
        details: 'Cart creation returned null'
      });
    }

    if (!cart.id) {
      console.error('Cart ID is missing:', cart);
      return res.status(500).json({ 
        error: 'Invalid cart data',
        details: 'Cart created but ID is missing'
      });
    }


    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {

      await existingItem.update({ quantity: existingItem.quantity + quantity });
      const updatedItem = await CartItem.findByPk(existingItem.id, {
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      return res.json({
        success: true,
        message: 'Cart item updated successfully',
        item: updatedItem
      });
    }

    try {
      const cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity
      });

      const createdItem = await CartItem.findByPk(cartItem.id, {
        include: [{
          model: Product,
          as: 'product'
        }]
      });

      if (!createdItem) {
        console.error('Failed to retrieve created cart item:', cartItem.id);
        return res.status(500).json({ 
          error: 'Failed to retrieve created cart item',
          details: 'Cart item created but could not be retrieved'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Item added to cart successfully',
        item: createdItem
      });
    } catch (error) {
      console.error('Error creating cart item:', error);
      return res.status(500).json({ 
        error: 'Error creating cart item',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ 
      error: 'Error adding item to cart',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'product'
      }]
    });
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const cart = await Cart.findByPk(cartItem.cartId);
    if (cart?.userId !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized to update this cart item' });
    }

    await cartItem.update({ quantity });
    res.json({
      success: true,
      message: 'Cart item updated successfully',
      item: cartItem
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ 
      error: 'Error updating cart item',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }


    const cart = await Cart.findByPk(cartItem.cartId);
    if (cart?.userId !== req.user?.id) {
      return res.status(403).json({ error: 'Not authorized to delete this cart item' });
    }

    await cartItem.destroy();
    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ 
      error: 'Error removing item from cart',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 