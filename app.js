// const express = require("express");
import "dotenv/config";
import express from "express";
import HelloRoutes from "./hello.js";
import Lab5 from "./Lab5.js";
import CourseRoutes from "./courses/routes.js";
// import ModuleRoutes from "./modules/routes.js";
import cors from "cors";
import AssignMentRoutes from "./assignments/routes.js";
import TodoRoutes from "./todos/routes.js";
import session from "express-session";
import mongoose from "mongoose";
import UserRoutes from "./users/routes.js";
const CONNECTION_STRING =
  process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas";
mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("connection issue", err));

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
const port = process.env.PORT || 4000;

const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUnitialized: false,
};
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json());

// ModuleRoutes(app);
CourseRoutes(app);
AssignMentRoutes(app);
Lab5(app);
TodoRoutes(app);
HelloRoutes(app);
UserRoutes(app);

app.listen(process.env.PORT || 4000);
