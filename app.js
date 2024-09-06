import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import sequelize from "./db/sequelize.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import ingredientsRouter from "./routes/ingredientsRouter.js";
import areasRouter from "./routes/areasRouter.js";
import followRouter from "./routes/followRouter.js"; // ветка follow-unfollow
import authRouter from "./routes/authRouter.js";
import {
  avatarAllowedExtensions,
  defaultPublicFolderName,
} from "./constants/constants.js";
import usersRouter from "./routes/usersRouter.js";

const WEB_SERVER_PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(
  express.static(defaultPublicFolderName, {
    extensions: [...avatarAllowedExtensions],
  })
);

app.use("/api/status", (_, res) => {
  res.json({ status: "OK" });
});

app.use("/api/categories", categoriesRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/areas", areasRouter);
app.use("/api/follow", followRouter); // ветка follow-unfollow
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

try {
  console.log(
    "Application started. Establishing connection to the database..."
  );
  await sequelize.authenticate();
  console.log("Database connection successful");
  app.listen(WEB_SERVER_PORT, () => {
    console.log(`Server is running. Use our API on port: ${WEB_SERVER_PORT}`);
  });
} catch (error) {
  console.log("Unable to connect to the database:", error.message);
  process.exit(1);
}
