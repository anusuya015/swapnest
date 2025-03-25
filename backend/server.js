import path from "path";
import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentController from './controllers/paymetController.js'
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",   // Your React app's URL
  methods: ["GET", "POST"],
  credentials: true
}));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/api/config/cloudinary", (req, res) => {
  res.send(process.env.CLOUDINARY_URL);
});
app.get("/api/config/cloudinarypreset", (req, res) => {
  res.send(process.env.CLOUDINARY_UPLOAD_PRESET);
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});



// Create payment order
app.use("/create-order",paymentController );
const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
