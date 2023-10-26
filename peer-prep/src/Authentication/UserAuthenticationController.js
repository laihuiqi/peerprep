import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase";

async function registerUser(userEmail, userPassword) {
  createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User Created Successfully: " + user);

      return true;
    })
    .catch((error) => {
      console.log("User Creation Unsuccessful: " + error);

      // Error
      return false;
    });
}

async function loginUser(userEmail, userPassword) {
  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User Logged In Successfully: " + user);

      return true;
    })
    .catch((error) => {
      console.log("User Login Unsuccessful: " + error);

      // Invalid Email/Password
      return false;
    });
}

async function logoutUser() {
  signOut(auth)
    .then(() => {
      console.log("Signout Successful");

      return true;
    })
    .catch((error) => {
      console.log("Could Not Signout: " + error);

      return false;
    });
}

async function resetUserPassword(userEmail) {
  sendPasswordResetEmail(auth, userEmail)
    .then(() => {
      console.log("Password Reset Email Sent Successfully");

      return true;
    })
    .catch((error) => {
      console.log("Could Not Send Password Reset Email : " + error);

      return false;
    });
}

function isUserLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      return true;
    } else {
      return false;
    }
  });
}

export {
  registerUser,
  loginUser,
  logoutUser,
  resetUserPassword,
  isUserLoggedIn,
};
