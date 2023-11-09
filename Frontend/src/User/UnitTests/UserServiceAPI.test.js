const {
  registerUser,
  loginUser,
  logoutUser,
  resetUserPassword,
  deleteUser,
  updateUserData,
  updateLoggedInUserPassword,
  elevateUserPrivilege,
  lowerUserPrivilege,
  getAllRegisteredUsers,
} = require("../UserServiceAPI");

const {
  getUserId,
  getUserName,
  getUserEmail,
  getUserPreferredLanguage,
  getUserGithubId,
  isUserAdmin,
} = require("../UserState");

const {
  getFirebaseUserCredentials,
  isUserLoggedIn,
} = require("../../Authentication/AuthenticationState");

test("Test User Registration Flow", async () => {
  return registerUser(
    "Test Name",
    "test@yahoo.com",
    "Password123",
    "TestGitHubId",
    "TestLanguage"
  ).then(async (data) => {
    expect(data).toBe(true);

    expect(await isUserLoggedIn()).toBe(true);
    expect(getUserName()).toBe("Test Name");

    expect(getFirebaseUserCredentials).not.toBe(null);
  });
});
