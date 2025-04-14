import express from 'express';
import { RequestHandler } from '../types/express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = express.Router();

// Create a new product
router.post('/', (async (req, res) => {
  await createProduct(req, res);
}) as RequestHandler);

// Get all products
router.get('/', (async (req, res) => {
  await getProducts(req, res);
}) as RequestHandler);

// Get a single product
router.get('/:id', (async (req, res) => {
  await getProduct(req, res);
}) as RequestHandler);

// Update a product
router.put('/:id', (async (req, res) => {
  await updateProduct(req, res);
}) as RequestHandler);

// Delete a product
router.delete('/:id', (async (req, res) => {
  await deleteProduct(req, res);
}) as RequestHandler);

export default router; 