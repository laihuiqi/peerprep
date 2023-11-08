# History Service Setup Guide

# Quick Start

1. Build the Containers.

Command:

```
docker-compose build
```

2. Start the Containers.
   Command:

```
docker-compose up
```

3. Using Postman or a likewise app, you can connect to `localhost:3006` to http send queries.

# Starting Containers Individually

## There are a few elements to take care of first:

1. Docker Network
2. mySQL Container
3. History Service Server Container

## Set Up a Docker Network (Bridge)

Set up a Docker network using the following command, and ensure to use the same network name when starting the various services and databases later. (This step is important if you dont want to run via `docker-compose up`)

Command:

```
docker network create -d bridge peer-prep-network
```

This command is to be run only for the initial set up, and once the network is setup, this step does not need to be repeated

## mySQL Container

First and foremost change the `databaseUrl` in the config.js file to `127.0.0.1`

Start by running this container first, else History Service will not be able to connect to Database.

Command:

```
docker run -d --rm -p 3306:3306 --name history-service-database --network peer-prep-network mysql:latest
```

### To access shell

Command:

```
docker exec -it history-service-database sh
```

The above will open a terminal window for the mySql Docker Container, where `mysql` can be used.

## History Service Server

Navigate to the `HistoryService` Directory in Terminal or Powershell

Build the container by running the following command

Command:

```
docker build -t history-service .
```

Run this container by running the following command

Command:

```
docker run --rm -p 3006:3006 -v $(pwd):/app -it --network peer-prep-network history-service
```
