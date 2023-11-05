# Generative AI Microservice for PeerPrep

### Features

- getResponse : From gpt-3.5-turbo
- endSession : clean up cache for user in a session
- getCache : restore current session conversation

### Table of Contents:

1. [Local Dependencies](#to-run-this-microservice-please-ensure-that-you-have-locally-installed)
2. [Listening Port](#listening-port)
3. [Initiate Generative AI Service - Local Machine](#start-the-microservice-on-local-machine-by)
4. [Local Testing](#for-backend-self-testing)
5. [Jest Testing](#jest-testing)
6. [Initiate Generative AI Service - Docker](#running-in-docker)


#### To run this microservice, please ensure that you have locally installed:

- Node.js ^18.0.0


#### Listening port

http://localhost:3004


#### Start the microservice on local machine by:

1. Navigate to peerprep directory.
   
2. Insert your own GPT-API_KEY for the services in the `peer-prep\src\backend\gpt-service\config\config.js` file as below:
   
``` 
const API_KEY = '<Your api key>';
```
   
3. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\gpt-service
npm install
npm start
```

4. Successful console output:

```
> gpt-service@1.0.0 start
> node server.js

GPT service listening on port 3004
```

5. End generative AI service in terminal using `Ctrl+C`.


#### For backend self-testing:

**Note**:

> Please ensure your API_KEY has respective subscription to gpt-3.5-turbo.

1. Getting a reply:
   
   Send **POST** request to:
   
    `http://localhost:3004/generate` and specify post fields.
   
   Example:
   
   Url link: `http://localhost:3004`

   For testing using Postman, enter data using the `Body` panel (2 methods are available):
   
   raw:

    ```
    {
    "userId":"Jgk9LsH3pRi2",
    "prompt":"What is the difference between a stack and a queue?"
    }
    ```

   x-www-form-urlencoded (using Bulk Edit):

    ```
    userId:Jgk9LsH3pRi2
    prompt:What is the difference between a stack and a queue?
    ```


   Server response :-
   
   Success: (Sample answer only, may be different due to creativity set.)
   
    ```
    {
    "status": "success",
    "reply": "A stack and a queue are both abstract data types used in computer science to represent collections of elements.

    1. Structure:
       - Stack: A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. It can be imagined as a stack of plates, where the last plate added will be the first one to be removed.
       - Queue: A queue, on the other hand, is a linear data structure that follows the First-In-First-Out (FIFO) principle. It can be thought of as a line of people waiting, where the person who joined first will be the first to be served.
    
    2. Insertion and Removal:
       - Stack: In a stack, elements are inserted and removed from the same end, called the top of the stack. When an element is inserted, it gets placed on top, and when an element is removed, the topmost element is removed.
       - Queue: In a queue, elements are inserted"
    }
    ```

   
2. Erase cache after ending a session:
   
   Send **DELETE** request to:
   
   `http://localhost:3004/exitGpt`
   
   Example:
   
   `http://localhost:3004/exitGpt`

   raw:

    ```
    {
    "userId":"Jgk9LsH3pRi2"
    }
    ```

   x-www-form-urlencoded (using Bulk Edit):

    ```
    userId:Jgk9LsH3pRi2
    ```

   Server response :-

    ```
    { "status": "success" }
    ```

3. Get conversation cache: (Before the respective session ends)
     
   Send **GET** request to:
   
   `http://localhost:3004/getCache`
   
   Example:
   
   `http://localhost:3004/getCache`

   raw:

    ```
    {
    "userId":"Jgk9LsH3pRi2"
    }
    ```

   x-www-form-urlencoded (using Bulk Edit):

    ```
    userId:Jgk9LsH3pRi2
    ```

   Server response :-

    ```
    { 
    "status": "success",
    "record": "[{
        "prompt": "What is the difference between a stack and a queue?",
        "reply": "A stack and a queue are both abstract data types used in computer science to represent collections of elements.

    1. Structure:
       - Stack: A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. It can be imagined as a stack of plates, where the last plate added will be the first one to be removed.
       - Queue: A queue, on the other hand, is a linear data structure that follows the First-In-First-Out (FIFO) principle. It can be thought of as a line of people waiting, where the person who joined first will be the first to be served.
    
    2. Insertion and Removal:
       - Stack: In a stack, elements are inserted and removed from the same end, called the top of the stack. When an element is inserted, it gets placed on top, and when an element is removed, the topmost element is removed.
       - Queue: In a queue, elements are inserted"
    }]"
    }
    ```

#### Jest testing

1. Test the service using terminal commands:

```
cd peer-prep\src\backend\gpt-service
npm test
```


#### Running in Docker

**Note**:

> Please delete the containers for other microservices.

1. Navigate to peerprep directory.

2. Insert your own GPT-API_KEY for the services in the `peer-prep\src\backend\gpt-service\config\config.js` file as below:
   
``` 
const API_KEY = '<Your api key>';
```
   
3. Start the microservice in terminal using commands:
   
```
cd peer-prep\src\backend\gpt-service
docker-compose up --build
```

4. Successful console output in docker:

```
> gpt-service@1.0.0 start
> node server.js
> GPT service listening on port 3004
```

5. End matching service in terminal using `Ctrl+C` twice.
