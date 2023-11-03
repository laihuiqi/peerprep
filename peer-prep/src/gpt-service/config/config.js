const API_ENDPOINT = 'https://api.openai.com/v1/completions';

const API_KEY = process.env.GPT_API_KEY;

module.exports = {
    PORT: 3004,
    API_ENDPOINT,
    API_KEY
};