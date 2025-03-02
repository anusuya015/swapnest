import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//  Fetch All Products with Keyword Search & Pagination
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword }) // ✅ Applied filter
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  if (products.length !== 0) {
    res
      .status(200)
      .json({ products, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404).json({ message: "No match found" });
  }
});

//  Fetch Product By ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: "No product found" });
  }
});

//  Delete Product By ID (Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne(); // Updated from remove()
    res.status(200).json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Create New Product
const createProduct = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  const {
    name,
    images,
    description,
    category,
    expiresOn,
    address,
    shippingCharge,
    price,
    negotiable,
  } = req.body;

  if (name.length < 3)
    throw new Error("Name must be at least 3 characters long");
  if (description.length < 7)
    throw new Error("Description must be at least 7 characters long");
  if (address.length < 5)
    throw new Error("Address must be at least 5 characters long");
  if (category.length < 5)
    throw new Error("Category must be at least 5 characters long");

  if (!Array.isArray(images) || images.length === 0) {
    res.status(400);
    throw new Error("Upload at least one image");
  }

  if (new Date(expiresOn) < new Date()) {
    res.status(400);
    throw new Error("Put an upcoming date");
  }

  const product = await Product.create({
    name,
    images,
    description,
    category,
    expiresOn,
    user: req.user._id,
    shippingAddress: { address, shippingCharge },
    seller: {
      sellername: req.user.name,
      selleraddress: req.user.address,
      selleremail: req.user.email,
      phoneNo: {
        mobile: req.user.contact.phone_no,
        isVerified: req.user.contact.isVerified,
      },
    },
    Cost: { price, negotiable },
  });

  if (product) {
    res.status(201).json({ message: "Your property is successfully listed" });
  } else {
    res.status(400);
    throw new Error("Invalid Property Data");
  }
});

//  Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    images,
    description,
    category,
    expiresOn,
    address,
    shippingCharge,
    price,
    negotiable,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (new Date(expiresOn) < new Date()) {
    res.status(400);
    throw new Error("Put an upcoming date");
  }

  if (name && name.length < 3)
    throw new Error("Name must be at least 3 characters long");
  if (description && description.length < 7)
    throw new Error("Description must be at least 7 characters long");
  if (address && address.length < 5)
    throw new Error("Address must be at least 5 characters long");
  if (category && category.length < 5)
    throw new Error("Category must be at least 5 characters long");

  if (product.user.toString() === req.user._id.toString() || req.user.isAdmin) {
    product.name = name || product.name;
    product.images = images || product.images;
    product.description = description || product.description;
    product.category = category || product.category;
    product.expiresOn = expiresOn || product.expiresOn;
    product.shippingAddress.address =
      address || product.shippingAddress.address;
    product.shippingAddress.shippingCharge =
      shippingCharge || product.shippingAddress.shippingCharge;
    product.Cost.price = price || product.Cost.price;
    product.Cost.negotiable = negotiable || product.Cost.negotiable;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(403).json({ message: "You cannot edit this product" });
  }
});

//give product review

const reviewProduct = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  console.log(req.body);
  const review = {
    name: req.user.name,
    comment,
    user: req.user._id,
  };
  const product = await Product.findById(req.params.id);

  product.reviews.push(review);

  await product.save();
  res.status(201).json({ message: "Review successfully added" });
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  reviewProduct,
};
