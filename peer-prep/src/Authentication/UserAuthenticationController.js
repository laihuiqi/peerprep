import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

async function registerUser(email, password) {
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, password)
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

async function loginUser(email, password) {
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
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
