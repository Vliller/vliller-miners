# vliller-miners

## Docker

Mounts containers

```bash
$ docker build -t vliller-miners .
$ docker network create vlillernet
$ docker-compose up -d
```

In crontab (each 2 minutes)

```bash
*/2 * * * * docker exec -w /usr/src/app vliller-miners npm run start:miner:vlille >/dev/null 2>>/home/alex/vliller-miners/.logs/error.log
```

Run a kibana on it

```bash
docker run -d -e ELASTICSEARCH_URL=http://localhost:9200/ -p=5601:5601 --name=vliller-kibana docker.elastic.co/kibana/kibana:6.4.2
```

## Production config

Fix elastic issue on OVH VPS

```bash
$ sudo sysctl -w vm.max_map_count=262144
```