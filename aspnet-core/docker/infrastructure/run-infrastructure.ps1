docker network rm mycompanyname.abpzerotemplate

docker network create mycompanyname.abpzerotemplate
docker-compose -f docker-compose.infrastructure.yml up -d

docker logs -f mssqlDb_container
