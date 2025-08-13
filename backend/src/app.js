import express from "express";
import router from "./routes/routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());
app.use("/api", router);
app.use(errorMiddleware);

export default app;