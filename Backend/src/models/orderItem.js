const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class OrderItem extends Model {}

OrderItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'orders', key: 'id' },
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'products', key: 'id' },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  timestamps: true,
});

module.exports = OrderItem; 