require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '123456789',
    database: process.env.MYSQL_DATABASE || 'ecommerce_db',
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '123456789',
    database: process.env.MYSQL_DATABASE || 'ecommerce_db',
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '123456789',
    database: process.env.MYSQL_DATABASE || 'ecommerce_db',
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
}; 