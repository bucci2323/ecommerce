import { Request, Response } from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
  try {

    const existingUser = await User.findOne({
      where: { email: req.body.email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }


    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    

    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });


    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.status(201).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User is  not found !!!' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error finding user' });
  }
};



export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    console.log('Updating user:', userId, 'Request body:', req.body);
    
// this user dey exist at all 
    const user = await User.findByPk(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    // check if the user is updating his/her profile or na admin dey update 
    if (req.user?.id !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }


    if (req.body.email) {
      const existingUser = await User.findOne({
        where: { email: req.body.email }
      });

      if (existingUser && existingUser.id !== userId) {
        console.log('Email already exists:', req.body.email);
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    // hash password if its being updated , it will uodate and hash the password
    if (req.body.password) {
      console.log('Password update detected, hashing...');
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Prepare update data
    const updateData = { ...req.body };
    console.log('Update data:', updateData);

    const [updated] = await User.update(updateData, {
      where: { id: userId }
    });

    if (updated) {
      console.log('User updated successfully');
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] } // Exclude password from response
      });
      res.json(updatedUser);
    } else {
      console.log('No rows updated');
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      error: 'Error updating user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const deleted = await User.destroy({
      where: { id: userId }
    });

    if (deleted) {
      res.status(200).json({ 
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: 'Error deleting user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error during login' });
  }
}; 