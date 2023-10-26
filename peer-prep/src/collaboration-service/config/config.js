const DEFAULT_TIME_LIMIT = {
    'Easy': 20 * 60 * 1000, // 20 mins
    'Intermediate': 40 * 60 * 1000, // 40 mins
    'Hard': 60 * 60 * 1000, // 60 mins
    'None': 30 * 60 * 1000 // 30 mins
}

const MAX_TIME_LIMIT = 2 * 60 * 60 * 1000; // 2 hours

const EXTENSION_TIME = 15 * 60 * 1000; // 15 mins

const DISCONNECTION_TIMEOUT = 30 * 1000; // 30 secs

const SYSTEM_TERMINATE_TIMEOUT = 10 * 1000; // 10 secsS

module.exports = {
    serverAddress: 'http://localhost:3002',
    //mongodbUri: 'mongodb://mongo_db:27017/peer-prep',
    mongodbUri: 'mongodb://127.0.0.1:27017/peer-prep',
    DEFAULT_TIME_LIMIT,
    MAX_TIME_LIMIT,
    EXTENSION_TIME,
    DISCONNECTION_TIMEOUT,
    SYSTEM_TERMINATE_TIMEOUT
};