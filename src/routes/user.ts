import express from "express";

import * as UserController from "../controllers/user";

export const userRoutes = express.Router();

userRoutes.post("/signup", UserController.createUser);
userRoutes.post("/login", UserController.userLogin);