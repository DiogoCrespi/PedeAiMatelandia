const User = require('./user');
const Product = require('./product');
const Order = require('./order');
const OrderItem = require('./orderItem');

// Associações adicionais podem ser feitas aqui, se necessário
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
}; 