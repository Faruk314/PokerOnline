import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./handlers/error";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";
import paymentRoutes from "./routes/payment";
import shopRoutes from "./routes/shop";
import http from "http";
import setupSocket from "./webSocket/socket";
import bodyParser from "body-parser";
import { handleWebHook } from "./controllers/payment";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const server = http.createServer(app);
export const io = setupSocket(server);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.post(
  "/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebHook
);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/shop", shopRoutes);

app.use(errorHandler);
