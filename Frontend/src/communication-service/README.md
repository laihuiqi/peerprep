# Communication Microservice for PeerPrep

### Features

- provide video call function with audio
- startCommunication : server socket events

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

http://localhost:3003


#### Start the microservice on local machine by:

1. Navigate to peerprep directory.
   
2. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\communication-service
npm install
npm start
```

3. Successful console output:

```
> communication-service@1.0.0 start
> node server.js

Communication service listening on port 3003
```

4. End communication service in terminal using `Ctrl+C`.


#### For backend self-testing:

Here demonstrate local testing using Webpage:

**Note**:

> This testing only available currently.

1. Follow step 1 to step 3 in [Initiate Communication Service - Local Machine](#start-the-microservice-on-local-machine-by).

2. In browser, create 2 webpage with url: `http://localhost:3003`.

3. Wait until `Call Collaborator panel` is initialized.

4. Click on the `Call Collaborator panel` once in one of the pages, local video will be initiated.

5. The `Accept Button` in the other page will be enabled, click it.

6. Video call is enabled now.

7. Stop video call by clicking the `End Button`. Video call will be ended for both clients.

8. End communication service in terminal using `Ctrl+C`.


#### Jest testing

1. Two terminal windows are required for Jest testing.

2. Initiate the communication service in first window by:

```
cd peer-prep\src\backend\communication-service
npm start
```

3. Test the service in the other window using terminal commands:

```
cd peer-prep\src\backend\communication-service
npm test
```

4. Quit the server after finished testing using `Ctrl+C`.


#### Running in Docker

**Note**:

> Please delete the containers for other microservices.

1. Navigate to peerprep directory.
   
2. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\communication-service
docker-compose up --build
```

3. Successful console output in docker:

```
> communication-service@1.0.0 start
> node server.js
> Communication service listening on port 3003
```

4. End communication service in terminal using `Ctrl+C` twice.

