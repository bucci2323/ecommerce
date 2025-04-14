import express from 'express';
import { RequestHandler } from '../types/express';
import { createReview, getProductReviews, getReview, updateReview, deleteReview } from '../controllers/review.controller';

const router = express.Router();

// Create a new review
router.post('/', (async (req, res) => {
  await createReview(req, res);
}) as RequestHandler);

// Get reviews for a product
router.get('/product/:productId', (async (req, res) => {
  await getProductReviews(req, res);
}) as RequestHandler);

// Get a single review
router.get('/:id', (async (req, res) => {
  await getReview(req, res);
}) as RequestHandler);

// Update a review
router.put('/:id', (async (req, res) => {
  await updateReview(req, res);
}) as RequestHandler);

// Delete a review
router.delete('/:id', (async (req, res) => {
  await deleteReview(req, res);
}) as RequestHandler);

export default router; 