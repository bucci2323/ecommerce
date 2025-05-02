import { Request, Response } from 'express';
import { Order, OrderItem, Product } from '../models';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, status, totalAmount, shippingAddress, paymentMethod, paymentStatus, orderItems } = req.body;

    if (!userId || !totalAmount || !shippingAddress || !paymentMethod || !orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({ error: 'User ID, total amount, shipping address, payment method, and order items are required' });
    }

    const numericUserId = Number(userId);
    const numericTotalAmount = Number(totalAmount);

    if (isNaN(numericUserId) || isNaN(numericTotalAmount)) {
      return res.status(400).json({ error: 'User ID and total amount must be valid numbers' });
    }

    // Validate order items
    for (const item of orderItems) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ error: 'Each order item must have productId, quantity, and price' });
      }

      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
      }
    }

    
    const order = await Order.create({
      userId: numericUserId,
      status: status || 'pending',
      totalAmount: numericTotalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending'
    });


    const createdOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const orderItem = await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });


        const product = await Product.findByPk(item.productId);
        if (product) {
          await product.update({
            stock: product.stock - item.quantity
          });
        }

        return orderItem;
      })
    );

    const createdOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'orderItems'
      }]
    });
    
    if (!createdOrder) {
      return res.status(500).json({ error: 'Error retrieving created order' });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      error: 'Error creating order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'orderItems'
      }]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Error fetching orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        as: 'orderItems'
      }]
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Error fetching order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedOrder = await Order.findByPk(req.params.id, {
        include: [{
          model: OrderItem,
          as: 'orderItems'
        }]
      });
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: 'Error updating order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await Order.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({
        success: true,
        message: 'Order deleted successfully'
      });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      error: 'Error deleting order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 