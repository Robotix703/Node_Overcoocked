const Instruction = require('./../models/instruction');

const handleRecipe = require("../compute/handleRecipe");
const baseIngredient = require("../compute/base/ingredient");

//POST
exports.writeInstruction = (req, res) => {
  const instruction = new Instruction({
    text: req.body.text,
    recipeID: req.body.recipeID,
    ingredientsID: req.body.ingredients,
    quantity: req.body.quantity
  });

  instruction.save()
    .then(result => {
      res.status(201).json({ id: result._id, instruction });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.writeInstructionByIngredientName = async (req, res) => {
  const text = req.body.text;
  const ingredientsName = req.body.ingredients.map(e => e.ingredientName);
  const ingredientsQuantity = req.body.ingredients.map(e => e.quantity);
  const recipeID = req.body.recipeID;

  const ingredientsID = await baseIngredient.getIngredientsIDByName(ingredientsName);

  if (ingredientsID[0]) {
    const instruction = new Instruction({
      text: text,
      recipeID: recipeID,
      ingredientsID: ingredientsID,
      quantity: ingredientsQuantity
    })

    instruction.save()
      .then(result => {
        res.status(201).json({ id: result._id, instruction });
      })
      .catch(error => {
        res.status(500).json({
          errorMessage: error
        })
      });
  } else {
    res.status(500).json({
      errorMessage: "No valid ingredient"
    });
  }
}

//GET
exports.readInstructions = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const instructionQuery = Instruction.find();

  if (pageSize && currentPage) {
    instructionQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  instructionQuery
    .then(documents => {
      res.status(200).json({ instructions: documents, instructionCount: Instruction.count() });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getByRecipeID = (req, res) => {
  handleRecipe.getIngredientsName(req.query.recipeID)
    .then(instructions => {
      res.status(200).json({ Instructions: instructions });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//PUT
exports.updateInstruction = (req, res) => {
  const instruction = new Instruction({
    _id: req.params.id,
    text: req.body.text,
    recipeID: req.body.recipeID,
    ingredientsID: [req.body.instructions],
    quantity: [req.body.quantity]
  });

  Instruction.updateOne({ _id: req.params.id }, instruction)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json(instruction);
      } else {
        res.status(401).json({ message: "Pas de modification" });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//DELETE
exports.deleteInstruction = (req, res) => {
  Instruction.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}