import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const createAccessToken = ({ userId, role }) => {
  const accessToken = jwt.sign(
    {
      userId,
      role,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15Min",
    },
  );

  return accessToken;
};

export const createRefreshToken = ({ userId, role }) => {
  const refreshToken = jwt.sign(
    {
      userId,
      role,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7Days",
    },
  );

  return refreshToken;
};
