const {
  connectToDatabase,
  getAttemptDetailsFromDatabase,
  addAttemptDetailsToDatabase,
} = require("../Controllers/HistoryDatabaseController");

beforeAll(async () => {
  await connectToDatabase();
}, 30000);

test("Add Attempt Details To Database", async () => {
  const result = await addAttemptDetailsToDatabase(
    "sampleUserId1",
    "sampleUserId2",
    "sampleSessionId",
    "sampleQuestionId",
    "Sample Question Title",
    "Sample Question Description",
    "Sample Question Category",
    "Sample Question Complexity"
  );

  expect(result[0].affectedRows).toEqual(1);
});

test("Get Attempt Details From Database", async () => {
  const result = await getAttemptDetailsFromDatabase("sampleUserId1");

  expect(result[0][0]["userId1"]).toEqual("sampleUserId1");
  expect(result[0][0]["userId2"]).toEqual("sampleUserId2");
  expect(result[0][0]["sessionId"]).toEqual("sampleSessionId");
  expect(result[0][0]["questionId"]).toEqual("sampleQuestionId");
  expect(result[0][0]["questionTitle"]).toEqual("Sample Question Title");
  expect(result[0][0]["questionDescription"]).toEqual(
    "Sample Question Description"
  );
  expect(result[0][0]["questionCategory"]).toEqual("Sample Question Category");
  expect(result[0][0]["questionComplexity"]).toEqual(
    "Sample Question Complexity"
  );
});
