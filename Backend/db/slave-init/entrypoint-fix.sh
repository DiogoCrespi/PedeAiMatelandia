   #!/bin/bash
   set -e

   until pg_isready -h db-master -p 5432 -U replicator; do
     echo "Aguardando o master ficar disponível..."
     sleep 2
   done

   rm -rf /var/lib/postgresql/data/*

   PGPASSWORD=replicapass pg_basebackup -h db-master -D /var/lib/postgresql/data -U replicator -Fp -Xs -P -R

   exec docker-entrypoint.sh postgres