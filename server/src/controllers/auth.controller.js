import UserModel from "../models/user.model.js";
import argon2 from "argon2";
import { createAccessToken, createRefreshToken } from "../utils/auth.utils.js";

/**
 * @description Register an user and save the from req.body
 * @param req express.Request
 * @param req.body Object
 * @param req.body.email String
 * @param req.body.name String
 * @param req.body.password String
 */

export const register = async (req, res) => {
  const { email, name, password } = req.body;

  const isUserAlreadyExists = await UserModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists with this email address",
      errors: [
        {
          field: "email",
          message: "User already exist with this email address",
        },
      ],
    });
  }

  const user = await UserModel.create({
    email,
    name,
    passwordHash: await argon2.hash(password),
  });

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });
};
