import { Request, Response } from 'express';
import { Category } from '../models';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parentId } = req.body;


    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }


    let numericParentId = null;
    if (parentId) {
      numericParentId = Number(parentId);
      if (isNaN(numericParentId)) {
        return res.status(400).json({ error: 'Parent ID must be a valid number' });
      }
    }

    const category = await Category.create({
      name,
      description,
      parentId: numericParentId
    });


    const createdCategory = await Category.findByPk(category.id);
    
    if (!createdCategory) {
      return res.status(500).json({ error: 'Error retrieving created category' });
    }

    res.status(201).json(createdCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ 
      error: 'Error creating category',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCategory = await Category.findByPk(req.params.id);
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const deleted = await Category.destroy({
      where: { id: categoryId }
    });

    if (deleted) {
      res.status(200).json({ 
        success: true,
        message: 'Category deleted successfully'
      });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      error: 'Error deleting category',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 