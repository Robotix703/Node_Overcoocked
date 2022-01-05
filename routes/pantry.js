const express = require("express");

const checkAuth = require("../middleware/check-auth");

const PantryControllers = require("../controllers/pantry");

const router = express.Router();

//GET
router.get("/", PantryControllers.readPantries);
router.get("/quantityLeft", PantryControllers.quantityLeft);
router.get("/getNearestExpirationDate", PantryControllers.getNearestExpirationDate);

//POST
router.post("/", PantryControllers.writePantry);

//PUT
router.put("/:id", checkAuth, PantryControllers.updatePantry);

//DELETE
router.delete("/:id", checkAuth, PantryControllers.deletePantry);

module.exports = router;
