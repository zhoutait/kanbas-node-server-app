// const express = require("express");
import express from "express";
import HelloRoutes from "./hello.js";
import Lab5 from "./Lab5.js";
import CourseRoutes from "./courses/routes.js";
import ModuleRoutes from "./modules/routes.js";
import cors from "cors";
import AssignMentRoutes from "./assignments/routes.js";
import TodoRoutes from "./todos/routes.js";
import session from "express-session";
import "dotenv/config";

const app = express();
app.use(
  cors({
    origin: ["*", "https://a5--dancing-douhua-9e1ea5.netlify.app"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH", "DELETE"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());

ModuleRoutes(app);
CourseRoutes(app);
AssignMentRoutes(app);
Lab5(app);
TodoRoutes(app);
HelloRoutes(app);

app.listen(process.env.PORT || 4000);
