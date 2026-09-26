import { Router } from "express";

const router = Router();

/**
 * @method POST
 * @route /api/products/
 * @description creates the products and save it's data into the DB, images will store on imagekit.
 * @param req.body = { title, description, images: url, price: { amount, currency}, sizes: [{size, stock}] }
 * 
 */

export default router;
