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
      expiresIn: "15m",
    },
  );

  return accessToken;
};

export const readAccessToken = ({ accessToken }) => {
  return jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
};

export const createRefreshToken = ({ userId, role }) => {
  const refreshToken = jwt.sign(
    {
      userId,
      role,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return refreshToken;
};

export const readRefreshToken = ({ refreshToken }) => {
  return jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
};
