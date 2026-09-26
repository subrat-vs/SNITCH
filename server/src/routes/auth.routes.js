import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  getMe,
  login,
  refresh,
  register,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @method POST
 * @route /api/auth/register
 * @param req.body = { email, name, password }
 * @response res.status = 201 ( if successful )
 */
router.post("/register", registerValidator, register);

/**
 * @method POST
 * @route /api/auth/login
 * @param req.body = { email, password }
 * @response res.status = 200
 */
router.post("/login", loginValidator, login);

/**
 * @method
 * @route POST /api/auth/refresh
 */
router.post("/refresh", refresh);

/**
 * @method GET
 * @route /api/auth/me
 */
router.get("/me", authenticate, getMe);

export default router;
