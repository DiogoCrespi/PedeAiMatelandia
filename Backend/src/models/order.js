const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order; 