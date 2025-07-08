# PedeAiMatelandia

Sistema de delivery escalável, pensado para suportar até 1 milhão de usuários, com arquitetura moderna e pronta para múltiplos frontends (web, mobile Flutter, etc). 

## Principais Tecnologias
- **Frontend:** React (web), pronto para integração com Flutter (mobile)
- **Backend:** Node.js (Express, Sequelize)
- **Banco de Dados:** PostgreSQL com replicação master-slave
- **Orquestração:** Docker Compose
- **Documentação:** Swagger

## Arquitetura
- Banco de dados com replicação (escrita no master, leitura no slave)
- Backend desacoplado, pronto para múltiplos clientes
- Estrutura modular e escalável

## Como rodar localmente
1. Clone o repositório:
   ```bash
   git clone https://github.com/DiogoCrespi/PedeAiMatelandia.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd PedeAiMatelandia
   ```
3. Suba os containers:
   ```bash
   docker-compose up -d --build
   ```
4. Acesse a documentação da API em: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Estrutura de Pastas
- `Frontend/` — código do frontend web
- `Backend/` — código do backend, banco e scripts

## Contribuição
Pull requests são bem-vindos!

---

> Projeto criado para fins de estudo e demonstração de arquitetura escalável para delivery. 