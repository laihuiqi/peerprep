// Stores the User State

import UserModel from "../DataModel/UserModel";

var currentLoggedInUser = null;

function setUserState(obtainedUser) {
  currentLoggedInUser = new UserModel("", "", "");
  currentLoggedInUser.updateUser(obtainedUser);
}

function updateUserState(
  updatedUserName,
  updatedUserEmail,
  updatedUserGithubId,
  updatedUserPreferredLanguage
) {
  if (currentLoggedInUser === null) {
    return;
  }

  currentLoggedInUser.updateName(updatedUserName);
  currentLoggedInUser.updateEmail(updatedUserEmail);
  currentLoggedInUser.updateGithubId(updatedUserGithubId);
  currentLoggedInUser.updatePreferredLanguage(updatedUserPreferredLanguage);
}

function isUserLoggedIn() {
  return currentLoggedInUser === null ? false : true;
}

function getUserId() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.id;
  }

  return null;
}

function getUserName() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.name;
  }

  return null;
}

function getUserEmail() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.email;
  }

  return null;
}

function getUserPreferredLanguage() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.preferredLanguage;
  }

  return null;
}

function getUserGithubId() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.githubId;
  }

  return null;
}

function getUserAdminStatus() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.adminStatus;
  }

  return null;
}

export {
  isUserLoggedIn,
  getUserId,
  getUserName,
  getUserEmail,
  getUserPreferredLanguage,
  getUserGithubId,
  getUserAdminStatus,
  setUserState,
  updateUserState,
};
