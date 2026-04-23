import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes    from "./routes/auth.js";
import memoryRoutes  from "./routes/memories.js";
import uploadRoutes  from "./routes/upload.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",     authRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/upload",   uploadRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));