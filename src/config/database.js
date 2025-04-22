const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  development: {
    username: process.env.MYSQL_USER ,
    password: process.env.MYSQL_PASSWORD ,
    database: process.env.MYSQL_DATABASE ,
    host: process.env.MYSQL_HOST ,
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.MYSQL_USER ,
    password: process.env.MYSQL_PASSWORD ,
    database: process.env.MYSQL_DATABASE ,
    host: process.env.MYSQL_HOST ,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.MYSQL_USER ,
    password: process.env.MYSQL_PASSWORD ,
    database: process.env.MYSQL_DATABASE ,
    host: process.env.MYSQL_HOST ,
    dialect: 'mysql',
    logging: false
  }
};

const env = process.env.NODE_ENV ;
const currentConfig = config[env];

const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    dialect: currentConfig.dialect,
    logging: currentConfig.logging
  }
);

module.exports = {
  config,
  sequelize
}; 