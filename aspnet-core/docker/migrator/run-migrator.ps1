docker-compose -f docker-compose.migrator.yml up -d
docker logs -f mycompanynameabpzerotemplatemigrator_container
docker container rm mycompanynameabpzerotemplatemigrator_container