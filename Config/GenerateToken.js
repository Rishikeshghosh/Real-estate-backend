import jwt from "jsonwebtoken";
export const generateJwtToken = async (id) => {
  try {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
  } catch (error) {
    throw new Error({ error: error.message });
  }
};

export const generateResetPasswordJwtToken = async (mail) => {
  try {
    return jwt.sign({ userEmail: mail }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
  } catch (error) {
    throw new Error({ error: error.message });
  }
};
