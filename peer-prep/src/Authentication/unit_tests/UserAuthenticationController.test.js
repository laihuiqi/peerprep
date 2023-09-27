const {
  registerUser,
  loginUser,
  logoutUser,
  resetUserPassword,
  isUserLoggedIn,
} = require("../UserAuthenticationController");

test("Test User Registration With Correct Credentials", () => {
  return registerUser("project548@yahoo.com", "Sample1234Password").then(
    (data) => {
      console.log("> Register With Correct Credentials: " + data);

      expect(data).toBe(true);
    }
  );
});

test("Test User Registration With Incorrect Credentials", () => {
  return registerUser("project548@", "Sample1234Password").then((data) => {
    console.log("> Register With Incorrect Credentials: " + data);

    expect(data).toBe(false);
  });
});

test("Test User Registration With Same Duplicate Email", () => {
  return registerUser("project548@yahoo.com", "Sample1234Password*2").then(
    (data) => {
      console.log("> Register With Duplicate Email: " + data);

      expect(data).toBe(false);
    }
  );
});

test("Test User Login With Correct Credentials", () => {
  return loginUser("project548@yahoo.com", "Sample1234Password").then(
    (data) => {
      console.log("> Login With Correct Credentials: " + data);

      expect(data).toBe(true);
    }
  );
});

test("Test User Login With Incorrect Email", () => {
  return loginUser("project548@", "Sample1234Password").then((data) => {
    console.log("> Login With Incorrect Email: " + data);

    expect(data).toBe(false);
  });
});

test("Test User Login With Incorrect Password", () => {
  return loginUser("project548@yahoo.com", "WrongPassword").then((data) => {
    console.log("> Login With Incorrect Password: " + data);

    expect(data).toBe(false);
  });
});

test("Test User Authentication State When Logged In", () => {
  return isUserLoggedIn().then((data) => {
    console.log("> Auth State When Logged In: " + data);

    expect(data).toBe(true);
  });
});

test("Test User Logout When User Logged In", () => {
  return logoutUser().then((data) => {
    console.log("> Logout When User Logged In: " + data);

    expect(data).toBe(true);
  });
});

test("Test User Authentication State When Logged Out", () => {
  return isUserLoggedIn().then((data) => {
    console.log("> Auth State When Logged Out: " + data);

    expect(data).toBe(false);
  });
});

test("Test Reset Password Email Being Sent With Correct Credentials", () => {
  return resetUserPassword("project548@yahoo.com").then((data) => {
    console.log("> Reset Password Email To Correct Credentials: " + data);

    expect(data).toBe(true);
  });
});

test("Test Reset Password Email Being Sent With Incorrect Credentials", () => {
  return resetUserPassword("project548@").then((data) => {
    console.log("> Reset Password Email To Incorrect Credentials: " + data);

    expect(data).toBe(false);
  });
});
