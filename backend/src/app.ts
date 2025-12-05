import express from "express";
import cors from "cors";
//import helmet from "helmet";

import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

//API Routes
app.use("/users", userRoutes);

export default app;
