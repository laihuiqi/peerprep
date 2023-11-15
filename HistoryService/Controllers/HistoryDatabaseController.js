// MySQL
const config = require("../Config/config");
const mySql = require("mysql2");

const DATABASE_NAME = config.databaseName;
const TABLE_NAME = config.tableName;

var pool = null;

async function connectToDatabase() {
  let connected = false;
  const maxRetries = 10;
  const retryInterval = 3000; // 3 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      pool = mySql
        .createPool({
          host: config.databaseUrl,
          port: config.databasePort,
          user: "root",
          password: "",
          database: "attemptsDatabase",
        })
        .promise();

      console.log(`Attempting to connect to database (Attempt ${attempt})...`);
      await pool.query(`SHOW DATABASES;`); // Simple query to test connection
      console.log("Connected to database.");
      connected = true;
      break;
    } catch (error) {
      console.error(
        `Database connection failed (Attempt ${attempt}):`,
        error.message
      );
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryInterval / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
  }

  if (!connected) {
    throw new Error("Failed to connect to database after multiple attempts.");
  }

  await setUpDatabase();
}

async function setUpDatabase() {
  // Create DB if not exists
  const createDbResult = await pool.query(
    `
      CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME} ;
    `
  );

  console.log(createDbResult);

  // Switch to Database
  const useDbResult = await pool.query(`USE ${DATABASE_NAME} ;`);

  console.log(useDbResult);

  const createTableResult = await pool.query(
    `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
    (historyId integer PRIMARY KEY AUTO_INCREMENT, 
    userId1 VARCHAR(255) NOT NULL, 
    userId2 VARCHAR(255) NOT NULL, 
    sessionId VARCHAR(255) NOT NULL, 
    questionId VARCHAR(255) NOT NULL, 
    questionTitle TEXT NOT NULL,
    questionDescription TEXT NOT NULL,
    questionCategory TEXT NOT NULL,
    questionComplexity TEXT NOT NULL,
    attempt_time TIMESTAMP NOT NULL DEFAULT NOW());
    `
  );

  console.log(createTableResult);

  console.log("History Database Set Up!");
}

async function getAttemptDetailsFromDatabase(userId) {
  const result = await pool.query(
    `
    SELECT * 
    FROM ${TABLE_NAME}
    WHERE userId1 = ? OR userId2 = ?
    `,
    [userId, userId]
  );
  return result;
}

async function addAttemptDetailsToDatabase(
  userId1,
  userId2,
  sessionId,
  questionId,
  questionTitle,
  questionDescription,
  questionCategory,
  questionComplexity
) {
  const result = await pool.query(
    `
    INSERT INTO ${TABLE_NAME}
    (userId1, userId2, sessionId, questionId, questionTitle, questionDescription, questionCategory, questionComplexity) 
    VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?)
    `,

    [
      userId1,
      userId2,
      sessionId,
      questionId,
      questionTitle,
      questionDescription,
      questionCategory,
      questionComplexity,
    ]
  );

  return result;
}

module.exports = {
  connectToDatabase,
  getAttemptDetailsFromDatabase,
  addAttemptDetailsToDatabase,
};
