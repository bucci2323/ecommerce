import { Request, Response } from 'express';
import { Product } from '../models';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    if (!name || !description || !price || !stock || !categoryId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Convert price and categoryId to numbers
    const numericPrice = Number(price);
    const numericCategoryId = Number(categoryId);
    const numericStock = Number(stock);

    if (isNaN(numericPrice) || isNaN(numericCategoryId) || isNaN(numericStock)) {
      return res.status(400).json({ error: 'Price, stock, and categoryId must be valid numbers' });
    }

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      stock: numericStock,
      imageUrl,
      categoryId: numericCategoryId
    });

    // Fetch the created product to ensure we have all fields
    const createdProduct = await Product.findByPk(product.id);
    
    if (!createdProduct) {
      return res.status(500).json({ error: 'Error retrieving created product' });
    }

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ 
      error: 'Error creating product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const deleted = await Product.destroy({
      where: { id: productId }
    });

    if (deleted) {
      res.status(200).json({ 
        success: true,
        message: 'Product deleted successfully'
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      error: 'Error deleting product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 