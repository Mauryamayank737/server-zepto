import express from "express";
import dotenv from "dotenv";
import { DataBaseConnection } from "./config/databaseConnection.js";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import indexRoute from "./route/index.route.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://client-zepto.vercel.app/", // Your front-end origin
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

app.use("/api",indexRoute)

app.listen(port, (req, res) => {
  DataBaseConnection();
  console.log(`server is running on http://localhost:${port}`);
});
