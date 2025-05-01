import { Request, Response } from 'express';
import { Review } from '../models';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { userId, productId, rating, comment } = req.body;


    if (!userId || !productId || !rating) {
      return res.status(400).json({ error: 'User ID, product ID, and rating are required' });
    }


    const numericUserId = Number(userId);
    const numericProductId = Number(productId);
    const numericRating = Number(rating);

    if (isNaN(numericUserId) || isNaN(numericProductId) || isNaN(numericRating)) {
      return res.status(400).json({ error: 'User ID, product ID, and rating must be valid numbers' });
    }

    const review = await Review.create({
      userId: numericUserId,
      productId: numericProductId,
      rating: numericRating,
      comment
    });


    const createdReview = await Review.findByPk(review.id);
    
    if (!createdReview) {
      return res.status(500).json({ error: 'Error retrieving created review' });
    }

    res.status(201).json(createdReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ 
      error: 'Error creating review',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

export const getReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching review' });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const [updated] = await Review.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedReview = await Review.findByPk(req.params.id);
      res.json(updatedReview);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating review' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const deleted = await Review.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting review' });
  }
}; 