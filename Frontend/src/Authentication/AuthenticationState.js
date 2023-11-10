// Stores the Authentication State

var firebaseUserCredentials = null;

function setFirebaseUserCredentials(obtainedUser) {
  firebaseUserCredentials = obtainedUser;
}

function getFirebaseUserCredentials() {
  return firebaseUserCredentials;
}

export { getFirebaseUserCredentials };

export default setFirebaseUserCredentials;
