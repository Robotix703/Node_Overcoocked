const express = require("express");

const checkAuth = require("../middleware/check-auth");

const PantryControllers = require("../controllers/pantry");

const router = express.Router();

//GET
router.get("/", PantryControllers.readPantries);

//POST
router.post("/", PantryControllers.writePantry);

//PUT
router.put("/:id", checkAuth, PantryControllers.updatePantry);

//DELETE
router.delete("/:id", checkAuth, PantryControllers.deletePantry);

module.exports = router;