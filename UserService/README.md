# User Service Setup Guide

## There are a few elements to take care of first:

1. Docker Network
2. MongoDB Container
3. User Service Server Container

## Set Up a Docker Network (Bridge)

Set up a Docker network using the following command, and ensure to use the same network name when starting the various services later.

Command:

```
docker network create -d bridge user-service-network
```

This command is to be run only for the initially set up, and once the network is setup, this step does not need to be repeated

## MongoDB Container

Navigate to the `UserServiceDatabase` Directory

Start by running this container first, else User Service will not be able to connect to Database

Command:

```
docker run -d --rm -p 27017:27017 -v $(pwd):/data/db --name user-service-database --network user-service-network mongo:latest
```

### To access mongosh

Command:

```
docker exec -it user-service-database bash
```

The above will open a terminal window for the MongoDB Docker Container, where `mongosh` can be used.

## User Service Server

Navigate to the `UserService` Directory

Build the container by running the following command

Command:

```
docker build -t user-service .
```

Run this container by running the following command

Command:

```
docker run --rm -p 3000:3000 -v $(pwd):/app -it --network user-service-network user-service
```
