// Arquivo de inicialização do servidor 
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor backend rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
    process.exit(1);
  }
})(); 