import { Request, Response } from 'express';
import { Product } from '../models/product';
import { Category } from '../models/category';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;


    if (!name || !description || !price || !stock || !categoryId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);
    const numericCategoryId = Number(categoryId);


    if (isNaN(numericPrice) || isNaN(numericStock) || isNaN(numericCategoryId)) {
      return res.status(400).json({ message: 'Price, stock, and categoryId must be valid numbers' });
    }


    if (numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }


    if (numericStock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }


    const category = await Category.findByPk(numericCategoryId);
    if (!category) {
      return res.status(400).json({ message: 'Category does not exist' });
    }

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      stock: numericStock,
      categoryId: numericCategoryId
    });


    const createdProduct = await Product.findByPk(product.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update({
      name,
      description,
      price,
      stock,
      categoryId
    });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
}; 