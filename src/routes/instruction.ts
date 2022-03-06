import express from "express";

const checkAuth = require("../middleware/check-auth");

const InstructionControllers = require("../controllers/instruction");

export const instructionRoutes = express.Router();

//GET
instructionRoutes.get("/", InstructionControllers.readInstructions);
instructionRoutes.get("/byRecipeID", InstructionControllers.getByRecipeID);
instructionRoutes.get("/countForRecipe", InstructionControllers.getInstructionCountForRecipe);
instructionRoutes.get("/byID", InstructionControllers.getInstructionByID);

//POST
instructionRoutes.post("/", checkAuth, InstructionControllers.writeInstruction);
instructionRoutes.post("/byIngredientName", checkAuth, InstructionControllers.writeInstructionByIngredientName);

//PUT
instructionRoutes.put("/:id", checkAuth, InstructionControllers.updateInstruction);

//DELETE
instructionRoutes.delete("/:id", checkAuth, InstructionControllers.deleteInstruction);
