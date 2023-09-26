import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

async function registerUser(userEmail, userPassword) {
  const auth = getAuth();

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
  const auth = getAuth();

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
  const auth = getAuth();

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
  const auth = getAuth();

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
  const auth = getAuth();

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
