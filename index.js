import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
import cors from "cors";
import { connectDB } from "./src/configs/dbConnection.js";
import appRoutes from "./src/routes/app.routes.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import { APP_URL } from "./src/configs/index.js";
import path from "path";
import adminRouter from "./src/routes/admin.routes.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

config();
app.use(cookieParser());
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://hoanightmares.org",
  "https://www.hoanightmares.org",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors."));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/public", appRoutes);
app.use("/admin", adminRouter);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`HOA running on ${APP_URL}`);
  });
});
