async function lowerUserPrivilege(userEmailToLower) {
  if ((await isUserAdmin()) === true) {
   const result = await updateUserPrivilege(userEmailToLower, false);
 
   if (result !== null && result.status === 200) {
    return true;
   }
  }
 
  return false;
 }
 
 async function getAllRegisteredUsers() {
  if ((await isUserAdmin()) === true) {
   const result = await getAllUsersData();
 
   if (result !== null && result.status === 200) {
    return result.data.users;
   }
  }
 
  return null;
 }
 
 export {
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
 };