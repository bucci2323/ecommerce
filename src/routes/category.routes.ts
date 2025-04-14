import express from 'express';
import { RequestHandler } from '../types/express';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = express.Router();

// Create a new category
router.post('/', (async (req, res) => {
  await createCategory(req, res);
}) as RequestHandler);

// Get all categories
router.get('/', (async (req, res) => {
  await getCategories(req, res);
}) as RequestHandler);

// Get a single category
router.get('/:id', (async (req, res) => {
  await getCategory(req, res);
}) as RequestHandler);

// Update a category
router.put('/:id', (async (req, res) => {
  await updateCategory(req, res);
}) as RequestHandler);

// Delete a category
router.delete('/:id', (async (req, res) => {
  await deleteCategory(req, res);
}) as RequestHandler);

export default router; 