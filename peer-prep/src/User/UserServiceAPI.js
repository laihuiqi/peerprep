// Provides APIs to Frontend

import {
  registerUserUsingFirebase,
  loginUserUsingFirebase,
  logoutUserUsingFirebase,
  resetUserPasswordUsingFirebase,
} from "../Authentication/UserAuthenticationController";

import {
  getUserData,
  postUserData,
  patchUserData,
  deleteUserData,
} from "./UserServiceClientController";

import { getFirebaseUserCredentials } from "../Authentication/AuthenticationState";

import { setUserState } from "./UserState";

async function registerUser(
  userName,
  userEmail,
  userPassword,
  userGithubId,
  userPreferredLanguage
) {
  const isFirebaseUserRegistrationSuccessful = await registerUserUsingFirebase(
    userEmail,
    userPassword
  );

  if (isFirebaseUserRegistrationSuccessful) {
    const userId = getFirebaseUserCredentials().uid;
    const result = await postUserData(
      userId,
      userName,
      userEmail,
      userGithubId,
      userPreferredLanguage
    );

    if (result !== null && result.status === 201) {
      setUserState(result.data.user);

      return true;
    }
  }

  return false;
}

async function loginUser(userEmail, userPassword) {
  const isFirebaseUserLoginSuccessful = await loginUserUsingFirebase(
    userEmail,
    userPassword
  );

  if (isFirebaseUserLoginSuccessful) {
    const userId = getFirebaseUserCredentials().uid;
    const result = await getUserData(userId);

    if (result !== null && result.status === 200) {
      setUserState(result.data.user);
      return true;
    }
  }

  await logoutUserUsingFirebase();
  return false;
}

async function logoutUser() {
  const result = await logoutUserUsingFirebase();

  return result;
}

async function resetUserPassword(userEmail) {
  const result = await resetUserPasswordUsingFirebase(userEmail);

  return result;
}

async function deleteUser() {}

export { registerUser, loginUser, logoutUser, resetUserPassword };
