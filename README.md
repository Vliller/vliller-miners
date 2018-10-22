# vliller-miners

## Docker

```bash
$ docker network create vlillernet
$ docker-compose up -d

$ docker build -t vliller-miners .
$ docker run --rm --network vlillernet vliller-miners
```

## Production config

```bash
$ sudo sysctl -w vm.max_map_count=262144
```