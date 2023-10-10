const {
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
} = require("../UserProfileUpdateController");

test("Test User Email Update With Properly Formatted Email When User Is Loggen In", () => {
  return updateUserEmail("updated@yahoo.com").then((data) => {
    console.log(
      "> Update With Correctly Formatted Email When User Is Loggen In: " + data
    );

    expect(data).toBe(true);
  });
});

test("Test User Email Update With Incorrectly Formatted Email When User Is Loggen In", () => {
  return updateUserEmail("updated.com").then((data) => {
    console.log(
      "> Update With Incorrectly Formatted Email When User Is Loggen In: " +
        data
    );

    expect(data).toBe(false);
  });
});

test("Test User Password Update When Logged In", () => {
  return updateUserPassword("NewToughPa55word").then((data) => {
    console.log("> Update Password When Logged In: " + data);

    expect(data).toBe(true);
  });
});

// Also need to test if user is logged out on deletion
test("Test User Account Deletion When User Is Logged In", () => {
  return deleteUserAccount().then((data) => {
    console.log("> User Account Deletion When User Is Logged In: " + data);

    expect(data).toBe(true);
  });
});

test("Test User Email Update When User Is Not Logged In", () => {
  return updateUserEmail("logged_out@yahoo.com").then((data) => {
    console.log("> Update Email When User Is Not Logged In: " + data);

    expect(data).toBe(false);
  });
});

test("Test User Password Update When Not Logged In", () => {
  return updateUserPassword("NewToughPa55word").then((data) => {
    console.log("> Update Password When Not Logged In: " + data);

    expect(data).toBe(false);
  });
});

test("Test User Account Deletion When User Is Not Logged In", () => {
  return deleteUserAccount().then((data) => {
    console.log("> User Account Deletion When User Is Not Logged In: " + data);

    expect(data).toBe(false);
  });
});
