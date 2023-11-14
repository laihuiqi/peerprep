# Collaboration Microservice for PeerPrep

### Features

- startCollaboration : server socket events
- getCollaborationHistory

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

http://localhost:3005


#### Start the microservice on local machine by:

1. Navigate to Collaboration directory.
   
2. Uncomment localhost addresses and comment the docker addresses for the services in the `Collaboration\config\config.js` file as below:
   
``` 
   // mongodbUri: "mongodb://collaboration-service-database:27017",
  // mongodbUri: "mongodb://127.0.0.1:27021/peer-prep",
mongodbUri: "mongodb://127.0.0.1:27017/peer-prep",
```

3. Initiate connection of local MongoDB service to address `mongodb://localhost:27017/peer-prep`.
   
4. Start the microservice in terminal using commands:
   
```
cd Collaboration-service
npm install
npm start
```

5. Successful console output:

```
> collaboration-service@1.0.0 start
> node server.js

Collaboration service listening on port 3005
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

    - join
    - user-joined
    - init-timer
    - system-terminate
    - init-code
    - recv-question
    - code-changed
    - language-changed
    - cleared
    - time-extended
    - notify-terminate
    - user-disconnected
    - success-reconnected
    - user-reconnected

3. Connect clients to server:

    Url 1: http://localhost:3005?sessionId=123c44c9-9bc3-402f-ba56-689eb0d2774d&userId=Gc2Bz9Nl8Wx4

    Url 2: http://localhost:3005?sessionId=123c44c9-9bc3-402f-ba56-689eb0d2774d&userId=PxJ3lVtWz8Kq

4. Test events using the message panel:

    - update-code: 

        Arg1 : number 

        Arg2 : string

    - update-language:
      
         Arg1: codes -> { line: Number,
	                       code: String,
	                       lastModifier: String }
      
    - clear

    - extend-time
      
    - user-terminate: 

        Arg1 : number 

        Arg2 : string
      
   - ack-terminate:

        Arg1 : number
     
        Arg2 : string

    - reconnect
  
    - disconnect


#### Jest testing

**Note**:
Testing is done on the initialization steps and the `getCollaborationHistory` function.

1. Test the service using terminal commands:

```
cd Collaboration-service
npm test
```

2. Quit the server after finished testing using `Ctrl+C`.


#### Running in Docker

**Note**:
Please ensure that there are no active container of the required services.

1. Navigate to peerprep directory.
   
2. Comment local database address and uncomment the docker address for the service in the `Collaboration-service\config\config.js` file as below:
   
```
mongodbUri: "mongodb://collaboration-service-database:27017",
// mongodbUri: "mongodb://127.0.0.1:27021/peer-prep",
// mongodbUri: "mongodb://127.0.0.1:27017/peer-prep",
```
   
3. Start the microservice in terminal using commands:
   
```
cd Collaboration-service
docker-compose up --build
```

4. Successful console output in docker:

```
> collaboration-service@1.0.0 start
> node server.js
> Collaboration service listening on port 3005
> MongoDB Connected: collaboration-service-database
```

5. End collaboration service in terminal using `Ctrl+C` twice.

