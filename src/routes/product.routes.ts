import express from 'express';
import { RequestHandler } from '../types/express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = express.Router();


router.post('/', (async (req, res) => {
  await createProduct(req, res);
}) as RequestHandler);


router.get('/', (async (req, res) => {
  await getProducts(req, res);
}) as RequestHandler);


router.get('/:id', (async (req, res) => {
  await getProduct(req, res);
}) as RequestHandler);


router.put('/:id', (async (req, res) => {
  await updateProduct(req, res);
}) as RequestHandler);


router.delete('/:id', (async (req, res) => {
  await deleteProduct(req, res);
}) as RequestHandler);

export default router; 