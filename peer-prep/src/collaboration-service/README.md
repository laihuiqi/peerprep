# Collaboration Microservice for PeerPrep

### Features

- startCollaboration : server socket events
- getQuestionById

### Table of Contents:

1. [Local Dependencies](#to-run-this-microservice-please-ensure-that-you-have-locally-installed)
2. [Listening Port](#listening-port)
3. [Initiate Collaboration Service - Local Machine](#start-the-microservice-on-local-machine-by)
4. [Local Testing](#for-backend-self-testing)
5. [Jest Testing](#jest-testing)
6. [Initiate Collaboration Service - Docker](#running-in-docker)


#### To run this microservice, please ensure that you have locally installed:

- Node.js ^18.0.0
- MongoDB ^7.0.0


#### Listening port

http://localhost:3002


#### Start the microservice on local machine by:

1. Navigate to peerprep directory.
   
2. Uncomment localhost addresses and comment the docker addresses for the services in the `peer-prep\src\backend\collaboration-service\config\config.js` file as below:
   
``` 
mongodbUri: 'mongodb://127.0.0.1:27017/peer-prep',
//mongodbUri: 'mongodb://mongo_db:27017/peer-prep',
```

3. Initiate connection of local MongoDB service to address `mongodb://localhost:27017/peer-prep`.
   
4. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\collaboration-service
npm install
npm start
```

5. Successful console output:

```
> collaboration-service@1.0.0 start
> node server.js

Collaboration service listening on port 3002
MongoDB Connected: 127.0.0.1
```

6. End collaboration service in terminal using `Ctrl+C`.


#### For backend self-testing:

Here demonstrate local testing using Postman:

**Note**:

> For Local Testing, please ensure MongDB has relevant stored data in MatchedPair and Question.

Sample data for Question collection:

   ```
    {
    "_id": {
        "$oid": "65378371752185e6e1b5b342"
    },
    "title": "test2",
    "description": "test_easy_java_arrays",
    "complexity": "Easy",
    "category": "Arrays",
    "language": "Java",
    "userTags": [],
    "__v": 0
    }
   ```

Sample data for MatchedPair collection:

   ```
    {
    "_id": {
        "$oid": "653225335725b53773fc050c"
    },
    "sessionId": "123c44c9-9bc3-402f-ba56-689eb0d2774d",
    "id1": "Gc2Bz9Nl8Wx4",
    "id2": "PxJ3lVtWz8Kq",
    "isEnded": false,
    "questionId": {"$oid": "65378371752185e6e1b5b342"},
    "language": "Java",
    "proficiency": "None",
    "difficulty": "Easy",
    "topic": "Arrays",
    "__v": 0
    }
   ```

1. In the history panel of Postman, click `new` button and select `Socket.io`.

2. Add events to listen include:

    - cleared
    - join
    - user-joined
    - init-code
    - code-changed
    - time-exceeded
    - notify-terminate
    - user-disconnected
    - user-reconnected
    - successfully-reconnected
    - system-terminated
    - time-extended
    - update-time

3. Connect clients to server:

    Url 1: http://localhost:3002?sessionId=123c44c9-9bc3-402f-ba56-689eb0d2774d&userId=Gc2Bz9Nl8Wx4

    Url 2: http://localhost:3002?sessionId=123c44c9-9bc3-402f-ba56-689eb0d2774d&userId=PxJ3lVtWz8Kq

4. Test events using the message panel:

    - update-code: (line not saved in MongoDB)

        Arg1 : number 

        Arg2 : string

    - change-line: (line saved in MongoDB)

        Arg1 : number 

        Arg2 : string

    - user-terminate: (line saved in MongoDB)

        Arg1 : number 

        Arg2 : string

    - extend-time
    - clear
    - reconnect


#### Jest testing

**Note**:

> Collections setup is required as above section, modifications to database data are expected. 

1. Two terminal windows are required for Jest testing.

2. Initiate the collaboration service in first window by:

```
cd peer-prep\src\backend\collaboration-service
npm start
```

3. Test the service in the other window using terminal commands:

```
cd peer-prep\src\backend\collaboration-service
npm test
```

4. Quit the server after finished testing using `Ctrl+C`.


#### Running in Docker

**Note**:

> Please delete the containers for other microservices.

1. Navigate to peerprep directory.
   
2. Comment local database address and uncomment the docker address for the service in the `peer-prep\src\backend\collaboration-service\config\config.js` file as below:
   
``` 
//mongodbUri: 'mongodb://127.0.0.1:27017/peer-prep',
mongodbUri: 'mongodb://mongo_db:27017/peer-prep',
```
   
4. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\collaboration-service
docker-compose up --build
```

5. Successful console output in docker:

```
> collaboration-service@1.0.0 start
> node server.js
> Collaboration service listening on port 3002
> MongoDB Connected: mongo_db
```

6. End collaboration service in terminal using `Ctrl+C` twice.

