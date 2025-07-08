#!/bin/bash
set -e

# Espera o master ficar disponível
until pg_isready -h db-master -p 5432 -U replicator; do
  echo "Aguardando o master ficar disponível..."
  sleep 2
done

# Limpa dados antigos do slave
rm -rf /var/lib/postgresql/data/*

# Clona o banco do master
PGPASSWORD=replicapass pg_basebackup -h db-master -D /var/lib/postgresql/data -U replicator -Fp -Xs -P -R

# Inicia o PostgreSQL normalmente
exec docker-entrypoint.sh postgres 