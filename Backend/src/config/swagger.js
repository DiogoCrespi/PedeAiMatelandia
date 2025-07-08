const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Delivery Escalável',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de delivery escalável',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 