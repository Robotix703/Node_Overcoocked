import express from "express";

const checkAuth = require("../middleware/check-auth");

const PantryControllers = require("../controllers/pantry");

export const pantryRoutes = express.Router();

//GET
pantryRoutes.get("/", PantryControllers.readPantries);
pantryRoutes.get("/quantityLeft", PantryControllers.quantityLeft);
pantryRoutes.get("/getNearestExpirationDate", PantryControllers.getNearestExpirationDate);
pantryRoutes.get("/fullPantryInventory", PantryControllers.getFullPantryInventory);
pantryRoutes.get("/byID", PantryControllers.getPantryByID);

//POST
pantryRoutes.post("/", checkAuth, PantryControllers.writePantry);
pantryRoutes.post("/createByIngredientName", checkAuth, PantryControllers.writePantryByIngredientName);
pantryRoutes.post("/freeze", checkAuth, PantryControllers.freezePantry);
pantryRoutes.post("/refreshTodoist", checkAuth, PantryControllers.refreshTodoist);

//PUT
pantryRoutes.put("/:id", checkAuth, PantryControllers.updatePantry);

//DELETE
pantryRoutes.delete("/:id", checkAuth, PantryControllers.deletePantry);
