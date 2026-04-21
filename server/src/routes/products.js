import { Router } from "express";
import { Product } from "../models/Product.js";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const withId = products.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      inStock: p.inStock !== false,
    }));
    return res.json(withId);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

productsRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: "not found" });
    }
    return res.json({
      id: product._id.toString(),
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      inStock: product.inStock !== false,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "not found" });
    }
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const { title, price, category, image, description, inStock } = req.body;
    if (!title || price == null || !category || !image) {
      return res
        .status(400)
        .json({ message: "title, price, category, and image are required" });
    }
    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ message: "price must be a non-negative number" });
    }
    const product = await Product.create({
      title: String(title).trim(),
      price: numPrice,
      category: String(category).trim(),
      image: String(image).trim(),
      description: description != null ? String(description) : "",
      inStock: typeof inStock === "boolean" ? inStock : true,
    });
    const json = product.toJSON();
    return res.status(201).json(json);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

productsRouter.patch("/:id", async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.inStock === "boolean") {
      updates.inStock = req.body.inStock;
    }
    if (req.body.title != null) updates.title = String(req.body.title).trim();
    if (req.body.price != null) {
      const n = Number(req.body.price);
      if (Number.isNaN(n) || n < 0) {
        return res.status(400).json({ message: "price must be a non-negative number" });
      }
      updates.price = n;
    }
    if (req.body.category != null) updates.category = String(req.body.category).trim();
    if (req.body.image != null) updates.image = String(req.body.image).trim();
    if (req.body.description != null) updates.description = String(req.body.description);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "no valid fields to update" });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) {
      return res.status(404).json({ message: "not found" });
    }
    return res.json({
      id: product._id.toString(),
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      inStock: product.inStock !== false,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "not found" });
    }
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

productsRouter.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "not found" });
    }
    return res.status(204).send();
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "not found" });
    }
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});
