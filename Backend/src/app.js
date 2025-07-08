// Arquivo de entrada da aplicação Express 
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rotas principais serão adicionadas aqui
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app; 