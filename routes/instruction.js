const express = require("express");

const checkAuth = require("../middleware/check-auth");

const InstructionControllers = require("../controllers/instruction");

const router = express.Router();

//GET
router.get("/", InstructionControllers.readInstructions);
router.get("/byRecipeID", InstructionControllers.getByRecipeID);
router.get("/countForRecipe", InstructionControllers.getInstructionCountForRecipe);
router.get("/byID", InstructionControllers.getInstructionByID);

//POST
router.post("/", checkAuth, InstructionControllers.writeInstruction);
router.post("/byIngredientName", checkAuth, InstructionControllers.writeInstructionByIngredientName);

//PUT
router.put("/:id", checkAuth, InstructionControllers.updateInstruction);

//DELETE
router.delete("/:id", checkAuth, InstructionControllers.deleteInstruction);

module.exports = router;
