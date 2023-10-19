const DEFAULT_TIME_LIMIT = {
    'Easy': 20 * 60 * 1000,
    'Intermediate': 40 * 60 * 1000,
    'Hard': 60 * 60 * 1000
}

const MAX_TIME_LIMIT = 2 * 60 * 60 * 1000;

const EXTENSION_TIME = 15 * 60 * 1000;

const DISCONNECTION_TIMEOUT = 30 * 1000;

module.exports = {
    mongodbUri: 'mongodb://127.0.0.1:27017/peer-prep',
    DEFAULT_TIME_LIMIT,
    MAX_TIME_LIMIT,
    EXTENSION_TIME,
    DISCONNECTION_TIMEOUT
};