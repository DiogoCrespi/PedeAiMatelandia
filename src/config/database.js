const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'delivery',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'adminpass',
  {
    host: process.env.DB_MASTER_HOST || 'db-master',
    dialect: 'postgres',
    port: process.env.DB_MASTER_PORT || 5432,
    logging: false,
    pool: {
      max: 20,
      idle: 30000,
      acquire: 60000,
    },
  }
);

module.exports = sequelize; 