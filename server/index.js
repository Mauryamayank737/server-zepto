import express from "express";
import dotenv from "dotenv";
import { DataBaseConnection } from "./config/databaseConnection.js";
import userRouter from "./route/user.router.js";
// import fileUpload from "express-fileupload";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.route.js";
import subcategory from "./route/subcategory.route.js";
import product from "./route/product.route.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your front-end origin
    credentials: true, // Allow cookies
  })
);
app.use(morgan('tiny'));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cookieParser());
app.use(express.json());
// app.use(fileUpload())


let port = process.env.PORT || 9000;
app.get((req, res) => {
  res.send(console.log("hello"));
});

app.use("/api/user", userRouter);
app.use("/api/category",categoryRouter)
app.use('/api/subcategory',subcategory)
app.use('/api/product',product)
app.use("/api/file" , uploadRouter)

app.listen(port, (req, res) => {
  DataBaseConnection();
  console.log(`server is running on http://localhost:${port}`);
});
