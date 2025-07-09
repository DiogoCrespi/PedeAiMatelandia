const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Endpoint de produtos (mock)
app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'Pizza Margherita', price: 39.9 },
    { id: 2, name: 'Hambúrguer Artesanal', price: 29.9 },
    { id: 3, name: 'Refrigerante Lata', price: 6.5 }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
}); 