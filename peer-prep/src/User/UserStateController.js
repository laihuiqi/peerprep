// Manage User State Using Local Storage

import { getUserData } from "./UserServiceClientController";
import { setUserState } from "./UserState";

const USER_LOCAL_STORAGE_KEYWORD = "USER_ID";

async function setLocalUserState(firebaseUserCredentials) {
  // If user logged out
  if (firebaseUserCredentials === null) {
    localStorage.setItem(USER_LOCAL_STORAGE_KEYWORD, "");
    setUserState(null);

    return;
  }

  //   const userIdStoredLocally = localStorage.getItem(USER_LOCAL_STORAGE_KEYWORD);

  //   if (
  //     userIdStoredLocally === "" ||
  //     userIdStoredLocally === firebaseUserCredentials.uid
  //   ) {
  const result = await getUserData(firebaseUserCredentials.uid);

  setUserState(result.data.user);

  localStorage.setItem(USER_LOCAL_STORAGE_KEYWORD, firebaseUserCredentials.uid);
}

// Set it empty as no user is logged in or user logged in is different
//   localStorage.setItem(USER_LOCAL_STORAGE_KEYWORD, "");
// }

export { setLocalUserState };
