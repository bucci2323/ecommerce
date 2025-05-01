import { sequelize } from '../config/database';
import { User } from './user';
import { Product } from './product';
import { Category } from './category';
import { Order } from './order';
import { OrderItem } from './orderItem';
import { Review } from './review';
import { Cart } from './cart';
import { CartItem } from './cartItem';


User.initialize(sequelize);
Product.initialize(sequelize);
Category.initialize(sequelize);
Order.initialize(sequelize);
OrderItem.initialize(sequelize);
Review.initialize(sequelize);
Cart.initialize(sequelize);
CartItem.initialize(sequelize);


const models = {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem,
};


Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem,
}; 