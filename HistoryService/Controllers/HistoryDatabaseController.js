// MySQL
const config = require("../Config/config");
const mySql = require("mysql2");

const DATABASE_NAME = config.databaseName;
const TABLE_NAME = config.tableName;

var pool = null;

async function connectToDatabase() {
  // Waiting for SQL Container to be up
  await new Promise((r) => setTimeout(r, 10000));

  pool = mySql
    .createPool({
      host: config.databaseUrl,
      port: config.databasePort,
      user: "root",
      password: "",
      //   database: DATABASE_NAME,
    })
    .promise();

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

  // Create Table if not exist
  const createTableResult = await pool.query(
    `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
    (historyId integer PRIMARY KEY AUTO_INCREMENT, 
    userId1 VARCHAR(255) NOT NULL, 
    userId2 VARCHAR(255) NOT NULL, 
    sessionId VARCHAR(255) NOT NULL, 
    questionId VARCHAR(255) NOT NULL, 
    attempt_time TIMESTAMP NOT NULL DEFAULT NOW());
    `
  );

  console.log(createTableResult);
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
  questionId
) {
  const result = await pool.query(
    `
    INSERT INTO ${TABLE_NAME}
    (userId1, userId2, sessionId, questionId) 
    VALUES 
    (?, ?, ?, ?)
    `,
    [userId1, userId2, sessionId, questionId]
  );

  return result;
}

module.exports = {
  connectToDatabase,
  getAttemptDetailsFromDatabase,
  addAttemptDetailsToDatabase,
};
