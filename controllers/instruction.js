const Instruction = require('./../models/instruction');

const handleRecipe = require("../compute/handleRecipe");
const baseIngredient = require("../compute/base/ingredient");
const baseInstruction = require("../compute/base/instruction");
const handleInstructions = require("../compute/handleInstructions");

//POST
exports.writeInstruction = (req, res) => {
  const instruction = new Instruction({
    text: req.body.text,
    recipeID: req.body.recipeID,
    ingredientsID: req.body.ingredients,
    quantity: req.body.quantity,
    order: req.body.order,
    cookingTime: req.body.cookingTime ?? undefined
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
  const ingredientsName = req.body.ingredients.map(e => e.ingredientName);
  const ingredientsQuantity = req.body.ingredients.map(e => e.quantity);

  const ingredientsID = await baseIngredient.getIngredientsIDByName(ingredientsName);

  if (ingredientsID[0]) {
    const instruction = new Instruction({
      text: req.body.text,
      recipeID: req.body.recipeID,
      ingredientsID: ingredientsID,
      quantity: ingredientsQuantity,
      order: req.body.order,
      cookingTime: req.body.cookingTime ?? undefined
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
  let fetchedInstructions = [];

  if (pageSize && currentPage) {
    instructionQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  instructionQuery
    .then(documents => {
      fetchedInstructions = documents;
      return Instruction.count();
    })
    .then(count => {
      res.status(200).json({ instructions: fetchedInstructions, instructionCount: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getByRecipeID = (req, res) => {
  handleRecipe.getInstructionsByRecipeID(req.query.recipeID)
    .then(instructions => {
      res.status(200).json({ Instructions: instructions });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getInstructionCountForRecipe = async (req, res) => {
  let count = await handleInstructions.getInstructionCountForRecipe(req.query.recipeID);
  res.status(200).json(count);
}
exports.getInstructionByID = async (req, res) => {
  handleInstructions.getPrettyInstructionByID(req.query.instructionID)
  .then(instruction => {
    res.status(200).json(instruction);
  })
  .catch(error => {
    res.status(500).json({
      errorMessage: error
    })
  });
}

//PUT
exports.updateInstruction = async (req, res) => {
  const ingredientsName = req.body.ingredients.map(e => e.ingredientName);
  const ingredientsQuantity = req.body.ingredients.map(e => e.quantity);

  const ingredientsID = await baseIngredient.getIngredientsIDByName(ingredientsName);
  
  baseInstruction.updateInstruction(
    req.params.id,
    req.body.text,
    undefined,
    ingredientsID,
    ingredientsQuantity,
    req.body.order,
    req.body.cookingTime
  )
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({status: "OK"});
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