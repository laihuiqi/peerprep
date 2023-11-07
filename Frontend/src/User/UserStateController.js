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

  const result = await getUserData(firebaseUserCredentials.uid);

  if (result !== null && result.status === 200) {
    setUserState(result.data.user);

    localStorage.setItem(
      USER_LOCAL_STORAGE_KEYWORD,
      firebaseUserCredentials.uid
    );
  }
}

export { setLocalUserState };