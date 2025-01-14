const request = require("supertest");
const app = require("../app");
const {
  connectToDatabase,
} = require("../Controllers/HistoryDatabaseController");

beforeAll(async () => {
  await connectToDatabase();
}, 30000);

test("Add a Valid Attempt: POST /history/add-attempt", async () => {
  const result = await request(app).post("/history/add-attempt").send({
    userId1: "A1",
    userId2: "A2",
    sessionId: "A3",
    questionId: "A4",
    questionTitle: "A5",
    questionDescription: "A6",
    questionCategory: "A7",
    questionComplexity: "A8",
  });

  expect(result.statusCode).toEqual(201);
  expect(result.body.result["affectedRows"]).toEqual(1);
});

test("Get a Valid Attempt Using UserId1: GET /history/:userId", async () => {
  const result = await request(app).get("/history/A1");

  expect(result.statusCode).toEqual(200);

  expect(result.body.result[0]["userId1"]).toEqual("A1");
  expect(result.body.result[0]["userId2"]).toEqual("A2");
  expect(result.body.result[0]["sessionId"]).toEqual("A3");
  expect(result.body.result[0]["questionId"]).toEqual("A4");
  expect(result.body.result[0]["questionTitle"]).toEqual("A5");
  expect(result.body.result[0]["questionDescription"]).toEqual("A6");
  expect(result.body.result[0]["questionCategory"]).toEqual("A7");
  expect(result.body.result[0]["questionComplexity"]).toEqual("A8");
});

test("Get a Valid Attempt Using UserId2: GET /history/:userId", async () => {
  const result = await request(app).get("/history/A2");

  expect(result.statusCode).toEqual(200);

  expect(result.body.result[0]["userId1"]).toEqual("A1");
  expect(result.body.result[0]["userId2"]).toEqual("A2");
  expect(result.body.result[0]["sessionId"]).toEqual("A3");
  expect(result.body.result[0]["questionId"]).toEqual("A4");
  expect(result.body.result[0]["questionTitle"]).toEqual("A5");
  expect(result.body.result[0]["questionDescription"]).toEqual("A6");
  expect(result.body.result[0]["questionCategory"]).toEqual("A7");
  expect(result.body.result[0]["questionComplexity"]).toEqual("A8");
});

test("Get a Non-existent Attempt: GET /history/:userId", async () => {
  const result = await request(app).get("/history/A99");

  expect(result.statusCode).toEqual(404);
});

test("Invalid Route: GET /", async () => {
  const result = await request(app).delete("/");

  expect(result.statusCode).toEqual(404);
  expect(result.body.error.message).toEqual("Route Not Found");
});

test("Add a Invalid Attempt: POST /history/add-attempt", async () => {
  // Missing "userId1"
  const result = await request(app).post("/history/add-attempt").send({
    userId2: "A2",
    sessionId: "A3",
    questionId: "A4",
    questionTitle: "A5",
    questionDescription: "A6",
    questionCategory: "A7",
    questionComplexity: "A8",
  });

  expect(result.statusCode).toEqual(500);
  expect(result.body.error).toEqual("Missing Fields or Internal Error");
});
