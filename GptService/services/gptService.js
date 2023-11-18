const config = require("../config/config");
const { OpenAI } = require("openai");

const gpt = new OpenAI({ apiKey: config.API_KEY });

let sessionCache = new Map();

const getResponse = async (userId, prompt) => {
  try {
    const response = await gpt.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_tokens: 200,
    });

    const answer = response.choices[0].message.content;

    cacheToSession(userId, prompt, answer);

    console.log(`Received response: ${answer}`);

    return { status: "success", reply: answer };
  } catch (error) {
    console.log("Error getting response from GPT-3: ", error);
    return { status: "error", message: error };
  }
};

const cacheToSession = (userId, prompt, reply) => {
  console.log(`Caching to session for ${userId}`);

  if (!sessionCache.has(userId)) {
    const record = [{ prompt: prompt, reply: reply }];
    sessionCache.set(userId, record);
  } else {
    const record = sessionCache.get(userId);
    const currRecord = { prompt, reply };

    record.push(currRecord);
    sessionCache.set(userId, record);
  }
};

const getCache = (userId) => {
  console.log(`Getting cache for ${userId}`);

  if (!sessionCache.has(userId)) {
    return { status: "error", message: "No session found for this user." };
  } else {
    const record = sessionCache.get(userId);
    return { status: "success", record: record };
  }
};

const exitSession = (userId) => {
  console.log(`Exiting session for ${userId}`);

  sessionCache.delete(userId);
  return true;
};

module.exports = {
  getResponse,
  getCache,
  exitSession,
};
