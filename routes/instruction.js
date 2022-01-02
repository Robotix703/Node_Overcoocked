const express = require("express");

const checkAuth = require("../middleware/check-auth");

const InstructionControllers = require("../controllers/instruction");

const router = express.Router();

//GET
router.get("/", InstructionControllers.readInstructions);

//POST
router.post("/", InstructionControllers.writeInstruction);

//PUT
router.put("/:id", checkAuth, InstructionControllers.updateInstruction);

//DELETE
router.delete("/:id", checkAuth, InstructionControllers.deleteInstruction);

module.exports = router;