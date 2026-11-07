import express from "express";
import { requestLogger } from "./middleware/request-logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/products", productRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route tidak ditemukan" });
});

app.use(errorHandler);

export default app;
