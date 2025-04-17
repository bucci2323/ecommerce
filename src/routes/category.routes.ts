import express from 'express';
import { RequestHandler } from '../types/express';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = express.Router();


router.post('/', (async (req, res) => {
  await createCategory(req, res);
}) as RequestHandler);


router.get('/', (async (req, res) => {
  await getCategories(req, res);
}) as RequestHandler);


router.get('/:id', (async (req, res) => {
  await getCategory(req, res);
}) as RequestHandler);


router.put('/:id', (async (req, res) => {
  await updateCategory(req, res);
}) as RequestHandler);


router.delete('/:id', (async (req, res) => {
  await deleteCategory(req, res);
}) as RequestHandler);

export default router; 