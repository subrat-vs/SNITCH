import UserModel from "../models/user.model.js";
import argon2 from "argon2";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";

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
          path: "email",
          msg: "User already exist with this email address",
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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  await UserModel.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  res.status(201).json({
    message: "User registered successfully",
    data: {
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
      accessToken,
    },
  });
};

/**
 * @description Login a user and create new set of accessToken and refreshToken
 * @param req express.Request
 * @param req.body Object
 * @param req.body.email String
 * @param req.body.password String
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });

  await UserModel.findOneAndUpdate(
    { email },
    {
      refreshToken,
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  res.status(200).json({
    message: "User loggedIn successfully",
    data: {
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
      accessToken,
    },
  });
};

/**
 * @description Verify the refresh token, rotate the access and refresh tokens, and return a new access token to the authenticated user.
 * @param req Express request object
 * @param res Express response object
 * @returns Sends a new access token or an authentication error response
 */
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is required",
    });
  }

  try {
    const decoded = readRefreshToken({ refreshToken });
    const { userId, role } = decoded;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    if (refreshToken !== user.refreshToken) {
      await UserModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
        // isAccountFreez: true,
      });

      return res.status(401).json({
        message: "Refresh token mismatch",
      });
    }

    const accessToken = createAccessToken({
      userId,
      role,
    });
    const newRefreshToken = createRefreshToken({
      userId,
      role,
    });

    await UserModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "Tokens rotated successfully",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
        accessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh Token",
    });
  }
};

export const getMe = async (req, res) => {
  const { userId, role } = req.user;
  const user = await UserModel.findById(userId);

  res.status(200).json({
    message: "User data fetch successfully",
    data: {
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
    },
  });
};
