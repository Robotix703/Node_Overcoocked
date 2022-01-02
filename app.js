const express = require('express');
const bodyParser = require("body-parser");
const BDD = require('./BDD');
const path = require('path');

//Routes
const ingredientRoutes = require("./routes/ingredients");
const instructionRoutes = require("./routes/instruction");

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
app.use("/api/ingredient", ingredientRoutes);
app.use("/api/instruction", instructionRoutes);

module.exports = app;
