# vliller-miners

## Docker

docker network create vlillernet
docker-compose up -d

docker build -t vliller-miners .
docker run --network vlillernet vliller-miners