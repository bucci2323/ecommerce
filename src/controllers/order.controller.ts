import { Request, Response } from 'express';
import { Order, OrderItem } from '../models';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, status, totalAmount, shippingAddress, paymentMethod, paymentStatus } = req.body;

    // Validate required fields
    if (!userId || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'User ID, total amount, shipping address, and payment method are required' });
    }

    // Convert IDs and amounts to numbers
    const numericUserId = Number(userId);
    const numericTotalAmount = Number(totalAmount);

    if (isNaN(numericUserId) || isNaN(numericTotalAmount)) {
      return res.status(400).json({ error: 'User ID and total amount must be valid numbers' });
    }

    const order = await Order.create({
      userId: numericUserId,
      status: status || 'pending',
      totalAmount: numericTotalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending'
    });

    // Fetch the created order to ensure we have all fields
    const createdOrder = await Order.findByPk(order.id, {
      include: [OrderItem]
    });
    
    if (!createdOrder) {
      return res.status(500).json({ error: 'Error retrieving created order' });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ 
      error: 'Error creating order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [OrderItem]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [OrderItem]
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedOrder = await Order.findByPk(req.params.id, {
        include: [OrderItem]
      });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating order' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await Order.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting order' });
  }
}; 