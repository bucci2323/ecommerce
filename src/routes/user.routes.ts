import express from 'express';
import { RequestHandler } from '../types/express';
import { createUser, getUsers, getUser, updateUser, deleteUser, login } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = express.Router();


router.post('/login', (async (req, res) => {
  await login(req, res);
}) as RequestHandler);

router.post('/', (async (req, res) => {
  await createUser(req, res);
}) as RequestHandler);


// from here down are the routes that uses authenicationa nd authorization


router.get('/', authenticate, (async (req, res) => {
  await getUsers(req, res);
}) as RequestHandler);

router.get('/:id', authenticate, (async (req, res) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  await getUser(req, res);
}) as RequestHandler);

// Update user route with proper authentication and authorization
router.put('/:id', authenticate, (async (req, res) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  // Check if user is updating their own profile or is an admin
  if (req.user?.id !== userId && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this user' });
  }
  await updateUser(req, res);
}) as RequestHandler);

// Delete user route  (admin only can delete a user sha)
router.delete('/:id', authenticate, authorize(['admin']), (async (req, res) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  await deleteUser(req, res);
}) as RequestHandler);

export default router; 

