module.exports = {
    PORT: 3001,
    mongodbUri: 'mongodb://127.0.0.1:27017/peer-prep',
    //mongodbUri: 'mongodb://mongo_db:27017/peer-prep',
    rabbitmqUrl: 'amqp://127.0.0.1:5672',
    //rabbitmqUrl: 'amqp://rabbitmq:5672'
    refreshDuration: 3000, // 3 seconds
    waitingDuration: 3000,
    matchingDuration: 57000,
    queueName: 'matchingQueue',
};