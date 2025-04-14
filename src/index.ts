import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import { User, Product, Category, Order, OrderItem, Review, Cart, CartItem } from './models';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Use force: false to prevent dropping tables
    // Use alter: false to prevent automatic schema changes
    await sequelize.sync({ force: false, alter: false });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Initialize database
testConnection();