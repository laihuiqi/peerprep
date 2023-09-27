import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase";

async function registerUser(userEmail, userPassword) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userEmail,
      userPassword
    );

    console.log("User Created Successfully: " + userCredential.user);

    return true;
  } catch (error) {
    // Error
    console.log("User Creation Unsuccessful: " + error);

    return false;
  }
}

async function loginUser(userEmail, userPassword) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userEmail,
      userPassword
    );

    console.log("User Logged In Successfully: " + userCredential.user);

    return true;
  } catch (error) {
    console.log("User Login Unsuccessful: " + error);

    // Invalid Email/Password
    return false;
  }
}

async function logoutUser() {
  try {
    await signOut(auth);

    console.log("Signout Successful");

    return true;
  } catch (error) {
    console.log("Could Not Signout: " + error);

    return false;
  }
}

async function resetUserPassword(userEmail) {
  try {
    await sendPasswordResetEmail(auth, userEmail);

    console.log("Password Reset Email Sent Successfully");

    return true;
  } catch (error) {
    console.log("Could Not Send Password Reset Email : " + error);

    return false;
  }
}

async function isUserLoggedIn() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Stop listening to further changes
      if (user) {
        resolve(true); // User is logged in
      } else {
        resolve(false); // User is not logged in
      }
    });
  });
}

export {
  registerUser,
  loginUser,
  logoutUser,
  resetUserPassword,
  isUserLoggedIn,
};
