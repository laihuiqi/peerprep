# Matching Microservice for PeerPrep

### Features

- findMatch
- cancelMatch

### Table of Contents:

1. [Local Dependencies](#to-run-this-microservice-please-ensure-that-you-have-locally-installed)
2. [Listening Port](#listening-port)
3. [RabbitMQ Set-Up](#run-rabbitmq-server-by)
4. [Initiate Matching Service - Local Machine](#start-the-microservice-on-local-machine-by)
5. [Local Testing](#for-backend-self-testing)
6. [Jest Testing](#jest-testing)
7. [Initiate Matching Service - Docker](#running-in-docker)


#### To run this microservice, please ensure that you have locally installed:

- Node.js ^18.0.0
- RabbitMQ Server ^3.12.5
- MongoDB ^7.0.0


#### Listening port

http://localhost:3001


#### Run RabbitMQ Server by:

1. Navigating to the Program Files directory 

2. Connect to local RabbitMQ Server by:

```
cd "..\RabbitMQ Server\rabbitmq_server-3.12.5\sbin"
rabbitmq-service start
rabbitmq-plugins enable rabbitmq_management
```

3. A UI management site will be hosted on `http://localhost:15672/`.


#### Start the microservice on local machine by:

1. Navigate to peerprep directory.
   
2. Uncomment localhost addresses and comment the docker addresses for the services in the `peer-prep\src\backend\matching-service\config\config.js` file as below:
   
``` 
mongodbUri: 'mongodb://127.0.0.1:27017/peer-prep',
//mongodbUri: 'mongodb://mongo_db:27017/peer-prep',
rabbitmqUrl: 'amqp://127.0.0.1:5672',
//rabbitmqUrl: 'amqp://rabbitmq:5672'
```

3. Initiate connection of local MongoDB service to address `mongodb://localhost:27017/peer-prep`.
   
4. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\matching-service
npm install
npm start
```

5. Successful console output:

```
> matching-service@1.0.0 start
> node server.js

Matching service listening on port 3001
MongoDB Connected: 127.0.0.1
```

6. End matching service in terminal using `Ctrl+C`.


#### For backend self-testing:

**Note**:

> For Local Testing, please ensure MongDB has relevant stored data in Question.

Sample data for Question collection:

```
{
  "_id": {
    "$oid": "65378371752185e6e1b5b68c"
  },
  "title": "test1",
  "description": "test_intermediate_python_strings",
  "complexity": "Intermediate",
  "category": "Strings",
  "language": "Python",
  "__v": 0
}
```

1. Finding a match:
   
   Send **POST** request to:
   
    `http://localhost:3000/home/:UserId` and specify post fields.
   
   Example:
   
   Set 1 :-
   
   Url link: `http://localhost:3001/home/Qa5Xb8Rv2KpL`

   For testing using Postman, enter data using the `Body` panel (2 methods are available):
   
   raw:

    ```
    {
    "id":"Qa5Xb8Rv2KpL",
    "language":"Python",
    "proficiency":"Basic",
    "difficulty":"Intermediate",
    "topic":"Strings"
    }
    ```

   x-www-form-urlencoded (using Bulk Edit):

    ```
    id:Qa5Xb8Rv2KpL
    language:Python
    proficiency:Basic
    difficulty:Intermediate
    topic:Strings
    ```

   Set 2 :-
   
   Url link: `http://localhost:3001/home/Zu8YkQ3mBvLx`

   For testing using Postman, enter data using the `Body` panel (2 methods are available):
   
   raw:

    ```
    {
    "id":"Zu8YkQ3mBvLx",
    "language":"Python",
    "proficiency":"Basic",
    "difficulty":"Intermediate",
    "topic":"Strings"
    }
    ```

   x-www-form-urlencoded (using Bulk Edit):

    ```
    id:Zu8YkQ3mBvLx
    language:Python
    proficiency:Basic
    difficulty:Intermediate
    topic:Strings
    ```

   Server response :-
   
   Success:
   
    ```
    {
    "status": "success",
    "isMatched": true,
    "sessionId": <a random uuid string, but should be same for a matched pair>,
    "questionId": "65378371752185e6e1b5b68c",
    "collaboratorId": "Zu8YkQ3mBvLx" or "Qa5Xb8Rv2KpL",
    "request": {
        "id": "Qa5Xb8Rv2KpL" or "Zu8YkQ3mBvLx",
        "language": "Python",
        "proficiency": "Basic",
        "difficulty": "Intermediate",
        "topic": "Strings"
    }
    }
    ```
   
   Matching Timed-out:
   
    ```
    {
    "status": "error",
    "isMatched": false,
    "sessionId": null,
    "questionId": null,
    "collaboratorId": null,
    "request": {
        "id": "Qa5Xb8Rv2KpL" or "Zu8YkQ3mBvLx",
        "language": "Python",
        "proficiency": "Basic",
        "difficulty": "Intermediate",
        "topic": "Strings"
    }
    ```
    
   
2. Canceling a match:
   
   Send **DELETE** request to:
   
   `http://localhost:3000/home/:UserId/matching`
   
   Example:
   
   `http://localhost:3000/home/Zu8YkQ3mBvLx/matching`

   Server response :-

    ```
    {
    "status": "cancel",
    "isMatched": false,
    "sessionId": null,
    "questionId": null,
    "collaboratorId": null,
    "request": {
        "id": "Zu8YkQ3mBvLx",
        "language": "Python",
        "proficiency": "Basic",
        "difficulty": "Intermediate",
        "topic": "Strings"
    }
    ```


#### Jest testing

1. Test the service using terminal commands:

```
cd peer-prep\src\backend\matching-service
npm test
```


#### Running in Docker

**Note**:

> Please delete the containers for other microservices.

1. Navigate to peerprep directory.
   
2. Comment localhost addresses and uncomment the docker addresses for the service in the `peer-prep\src\backend\matching-service\config\config.js` file as below:
   
``` 
//mongodbUri: 'mongodb://127.0.0.1:27017/peer-prep',
mongodbUri: 'mongodb://mongo_db:27017/peer-prep',
//rabbitmqUrl: 'amqp://127.0.0.1:5672',
rabbitmqUrl: 'amqp://rabbitmq:5672'
```
   
4. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\matching-service
docker-compose up --build
```

5. Successful console output in docker:

```
> matching-service@1.0.0 start
> node server.js
> Matching service listening on port 3001
> MongoDB Connected: mongo_db
```

6. End matching service in terminal using `Ctrl+C` twice.
