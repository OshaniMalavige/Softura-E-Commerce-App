import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const getUserData = () => {
  let user = {};
  const userData = Cookies.get("user");

  if (userData) {
    try {
      const decryptedData = CryptoJS.AES.decrypt(
        userData,
        "!ODM@#$96",
      ).toString(CryptoJS.enc.Utf8);
      user = JSON.parse(decryptedData);
    } catch (error) {
      console.error("Decryption error:", error.message);
      user = {};
    }
  } else {
    // Only log the error if the user should already be logged in or have the cookie set
    if (isUserExpectedToBeLoggedIn()) {
      console.error("No userData cookie found");
    }
  }

  return user;
};

// A mock function to simulate a check for whether the user should be logged in or not
const isUserExpectedToBeLoggedIn = () => {
  return false; // Default to false for now
};

export default getUserData;
