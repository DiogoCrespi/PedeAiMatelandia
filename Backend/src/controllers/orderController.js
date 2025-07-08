const { Order, OrderItem, Product } = require('../models');

exports.create = async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens do pedido são obrigatórios' });
    }
    // Calcula total e valida produtos
    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.available) {
        return res.status(400).json({ error: `Produto inválido: ${item.productId}` });
      }
      const price = parseFloat(product.price);
      total += price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price });
    }
    const order = await Order.create({
      userId: req.user.id,
      address,
      total,
      status: 'pending',
    });
    for (const item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id });
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

exports.list = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id }, include: [OrderItem] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
};

exports.get = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [OrderItem] });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
}; 