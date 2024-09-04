import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import recipesRouter from "./routes/recipesRouter.js";
import sequelize from "./db/sequelize.js";


const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/recipes", recipesRouter);
app.use('/api', recipesRouter);

app.use("/api/status", (_, res) => {
  res.json({ status: "OK" });
});

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

try {
  await sequelize.authenticate();
  console.log("Database connection successful");
  app.listen(3000, () => {
    console.log("Server is running. Use our API on port: 3000");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
