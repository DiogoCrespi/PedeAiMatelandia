A configuração do slave será feita via entrypoint customizado ou script de inicialização.
 
Exemplo de configuração (recovery.conf ou postgresql.auto.conf):
primary_conninfo = 'host=db-master port=5432 user=replicator password=replicapass' 