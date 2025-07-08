const { Sequelize } = require('sequelize');
require('dotenv').config();

const master = {
  host: process.env.DB_MASTER_HOST || 'localhost',
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'adminpass',
  database: process.env.DB_NAME || 'delivery',
  dialect: 'postgres',
  port: process.env.DB_MASTER_PORT || 5432,
};

const slave = {
  host: process.env.DB_SLAVE_HOST || 'localhost',
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'adminpass',
  database: process.env.DB_NAME || 'delivery',
  dialect: 'postgres',
  port: process.env.DB_SLAVE_PORT || 5433,
};

const sequelize = new Sequelize({
  replication: {
    read: [slave],
    write: master,
  },
  pool: {
    max: 20,
    idle: 30000,
    acquire: 60000,
  },
  logging: false,
});

module.exports = sequelize; 