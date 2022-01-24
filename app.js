const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

const BDD = require('./BDD');
const iniWorkers = require("./initialization");

//BDD
BDD.connectToDataBase()
.then(() => {
    console.log("BDD - Connectée");

    //Init modules
    iniWorkers.init();
})
.catch((error) => {
    console.log("BDD - Erreur de connexion");
    console.error(error);
});

//Routes
const userRoutes = require("./routes/user");
const ingredientRoutes = require("./routes/ingredients");
const instructionRoutes = require("./routes/instruction");
const recipeRoutes = require("./routes/recipe");
const pantryRoutes = require("./routes/pantry");
const mealRoutes = require("./routes/meal");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS, PUT");

    next();
});

//Use routes
app.use("/api/user", userRoutes);
app.use("/api/ingredient", ingredientRoutes);
app.use("/api/instruction", instructionRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/meal", mealRoutes);

module.exports = app;
