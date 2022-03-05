import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import path from 'path';
import cors from 'cors';

import * as BDD from './BDD';
//import { init } from "./initialization";

BDD.connectToDataBase()
.then(() => {
    console.log("BDD - Connectée");

    //init();
})
.catch((error: Error) => {
    console.log("BDD - Erreur de connexion");
    console.error(error);
});

//Routes
import { userRoutes } from "./routes/user";
/*

const ingredientRoutes = require("./routes/ingredients");
const instructionRoutes = require("./routes/instruction");
const recipeRoutes = require("./routes/recipe");
const pantryRoutes = require("./routes/pantry");
const mealRoutes = require("./routes/meal");
const todoItemRoutes = require("./routes/todoItem");
*/
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use("/images", express.static(path.join("images")));

//Use routes
app.use("/api/user", userRoutes);

/*

app.use("/api/ingredient", ingredientRoutes);
app.use("/api/instruction", instructionRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/meal", mealRoutes);
app.use("/api/todoItem", todoItemRoutes);
*/

module.exports = app;