# Matchmaking Microservice for PeerPrep

### To run this microservice, plaese ensure that you have locally installed:
- Node.js ^18.0.0
- RabbitMQ Server ^3.12.5
- MongoDB ^7.0.0

### Listening port
http://localhost:3001

### Run RabbitMQ Server by:
1. Navigating to the Program Files directory 
2. ```
   cd "..\RabbitMQ Server\rabbitmq_server-3.12.5\sbin"
   rabbitmq-service start
   rabbitmq-plugins enable rabbitmq_management
   ```
3. A UI management site will be hosted on `http://localhost:15672/`.

Start the microservice by (In peerprep directory):
```
cd peer-prep\src\backend\matching-service
npm install
npm start
```

### For backend testing:
1. Finding a match:
   
   Send **POST** request to:
   
    `http://localhost:3000/home/:UserId` and specify post fields.
   
   Example:
   
    `http://localhost:3000/home/1`
   
    { id: 1,
    language: "Java",
    proficiency: "Advanced",
    difficulty: "Easy",
    topic: "Strings" }
   
2. Canceling a match:
   
   Send **DELETE** request to:
   
   `http://localhost:3000/home/:UserId/matching`
   
   Example:
   
   `http://localhost:3000/home/1/matching`
