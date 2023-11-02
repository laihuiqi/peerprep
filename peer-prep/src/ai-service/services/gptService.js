const axios = require('axios');
const config = require('../config/config');
const { OpenAI } = require('openai');

const gpt = new OpenAI({ apiKey: config.API_KEY });

const getResponse = async (prompt) => {
    try {
      const response = await gpt.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens:200
        });
        
      const answer = response.data.choices[0].text;
      return { status: 'success', reply: answer };

    } catch (error) {
        console.log('Error getting response from GPT-3: ', error);
        return { status: 'error', message: error };
    }
}

module.exports = {
    getResponse,
}