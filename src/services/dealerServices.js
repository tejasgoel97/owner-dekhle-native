import api from "./api";

const getDealerName = async (phoneNumber) => {
  try {
    const response = await api.get("/auth/dealerName", {
      params: { phoneNumber },
    });
    console.log("res", response.data);
    return response.data;
  } catch (error) {
    // Handle error
    console.log(error);
    console.error("Error fetching dealer name:", error);
    // throw error;
  }
};

// Assuming api is set up for Axios; you can replace it with fetch if not using Axios
const register = async (data) => {
  try {
    const response = await api.post("/auth/email/register", data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await api.post("/auth/verifyOTP", {
      phoneNumber,
      otp,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    // throw error;
  }
};
const sendOTPLogin = async (phoneNumber) => {
  try {
    const response = await api.post("/auth/register", phoneNumber);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export { getDealerName, register, verifyOTP };
