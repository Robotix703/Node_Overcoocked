const express = require("express");

const checkAuth = require("../middleware/check-auth");

const PantryControllers = require("../controllers/pantry");

const router = express.Router();

//GET
router.get("/", PantryControllers.readPantries);
router.get("/quantityLeft", PantryControllers.quantityLeft);
router.get("/getNearestExpirationDate", PantryControllers.getNearestExpirationDate);
router.get("/fullPantryInventory", PantryControllers.getFullPantryInventory);
router.get("/byID", PantryControllers.getPantryByID);

//POST
router.post("/", PantryControllers.writePantry);
router.post("/createByIngredientName", PantryControllers.writePantryByIngredientName);

//PUT
router.put("/:id", checkAuth, PantryControllers.updatePantry);

//DELETE
router.delete("/:id", checkAuth, PantryControllers.deletePantry);

module.exports = router;
