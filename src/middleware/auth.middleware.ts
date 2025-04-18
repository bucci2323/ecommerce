import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: number;
      email: string;
      role: string;
    };


    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'role']
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else {
      console.error('Authentication error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const authorize = (roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        message: 'Access denied',
        requiredRoles: roles,
        userRole: req.user.role
      });
      return;
    }

    next();
  };
}; 