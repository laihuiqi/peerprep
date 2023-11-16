# Communication Microservice for PeerPrep

### Features

- provide audio call
- startCommunication : server socket events for text based communication

### Table of Contents:

1. [Local Dependencies](#to-run-this-microservice-please-ensure-that-you-have-locally-installed)
2. [Listening Port](#listening-port)
3. [Initiate Communication Service - Local Machine](#start-the-microservice-on-local-machine-by)
4. [Local Testing](#for-backend-self-testing)
5. [Jest Testing](#jest-testing)
6. [Initiate Communication Service - Docker](#running-in-docker)


#### To run this microservice, please ensure that you have locally installed:

- Node.js ^18.0.0


#### Listening port

http://localhost:3007


#### Start the microservice on local machine by:

1. Navigate to CommunicationService directory.
   
2. Start the microservice in terminal using commands:
   
```
cd CommunicationService
npm install
npm start
```

3. Successful console output:

```
> communication-service@1.0.0 start
> node server.js

Communication service listening on port 3007
```

4. End communication service in terminal using `Ctrl+C`.


#### For backend self-testing:

Here demonstrate local testing using Postman:

1. In the history panel of Postman, click `new` button and select `Socket.io`.

2. Add events to listen include:

    - join
    - collaborator-joined
    - collaborator-recv-join
    - new-message
    - recv-message-log
    - called
    - answered
    - colllaborator-end-call
    - call-rejected
    - collaborator-disconnected
    - ice-candidate

3. Connect clients to server:

    Url 1: http://localhost:3007?sessionId=123c44c9-9bc3-402f-ba56-689eb0d2774d&userId=Gc2Bz9Nl8Wx4

    Url 2: http://localhost:3007?sessionId=123c44c9-9bc3-402f-ba56-689eb0d2774d&userId=PxJ3lVtWz8Kq

4. Test events using the message panel:

    - recv-join

    - message

        Arg1: string
      
    - get-message-log

    - call

        Arg1: any

    - answer

        Arg1: any

    - end-call
      
    - reject-call
  
    - disconnect
  
    - ice-candidate
        Arg1: any


#### Jest testing

1. Test the service using terminal commands:

```
cd CommunicationService
npm test
```

2. Quit the server after finished testing using `Ctrl+C`.


#### Running in Docker

**Note**:

> Please ensure that there are no active container of the required services.

1. Navigate to CommunicationService directory.
   
2. Start the microservice in terminal using commands:
   
```
cd CommunicationService
docker-compose up --build
```

3. Successful console output in docker:

```
> communication-service@1.0.0 start
> node server.js
> Communication service listening on port 3007
```

4. End communication service in terminal using `Ctrl+C` twice.

