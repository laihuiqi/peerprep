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
  isUserLoggedIn,
  getUserId,
  getUserName,
  getUserEmail,
  getUserPreferredLanguage,
  getUserGithubId,
  getUserAdminStatus,
} = require("../UserState");

const {
  getFirebaseUserCredentials,
} = require("../../Authentication/AuthenticationState");

test("Test User Registration Flow", () => {
  return registerUser(
    "Test Name",
    "test@yahoo.com",
    "Password123",
    "TestGitHubId",
    "TestLanguage"
  ).then((data) => {
    expect(data).toBe(true);

    expect(isUserLoggedIn()).toBe(true);
    expect(getUserName()).toBe("Test Name");

    expect(getFirebaseUserCredentials).not.toBe(null);
  });
});
