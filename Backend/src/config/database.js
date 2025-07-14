const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'delivery',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'adminpass',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
  }
);

module.exports = sequelize; 