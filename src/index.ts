import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import { User, Product, Category, Order, OrderItem, Review, Cart, CartItem } from './models';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();
const port = process.env.PORT ;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);


app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {

    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    

    await sequelize.sync({ force: false, alter: false });
    console.log('Database synchronized successfully.');


    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
};


startServer();