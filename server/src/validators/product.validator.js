import { body } from "express-validator";

export const createProductValidator = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title length must be between 2 and 100 characters")
    .bail()
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Title can only contain English letters, spaces, and hyphens"),

  body("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("Description length must be between 20 and 500 characters"),

  body("images")
    .isArray({ min: 1, max: 5 })
    .withMessage("Images must contain between 1 and 5 items"),

  body("images.*")
    .isString()
    .withMessage("Each image must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Image URL cannot be empty"),

  body("price.amount")
    .exists({ checkFalsy: true })
    .withMessage("Price amount is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price amount must be a number greater than or equal to 0"),

  body("price.currency")
    .exists()
    .withMessage("Currency is required")
    .bail()
    .isString.withMessage("Currency must be a string value")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("Currency must be either INR or USD"),

  body("sizes").optional().isArray().withMessage("Sizes must be an array"),

  body("sizes.*.size")
    .exists({ checkFalsy: true })
    .withMessage("Size is required")
    .bail()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Invalid size"),

  body("sizes.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be an integer greater than or equal to 0"),

  body("seller")
    .exists({ checkFalsy: true })
    .withMessage("Seller is required")
    .bail()
    .isMongoId()
    .withMessage("Seller must be a valid MongoDB ObjectId"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

export default createProductValidator;
