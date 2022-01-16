const { getIngredientsIDByName } = require('../compute/getIngredientsIDByName');
const Instruction = require('./../models/instruction');

//POST
exports.writeInstruction = (req, res) => {
  const instruction = new Instruction({
    text: req.body.text,
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

  let ingredientsID = await getIngredientsIDByName(ingredientsName);

  if(ingredientsID[0]){
    const instruction = new Instruction({
      text: text,
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
  }else{
    res.status(500).json({
      errorMessage: "No valid ingredient"
    })
  }
}

//GET
exports.readInstructions = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const instructionQuery = Instruction.find();
  let fetchedInstructions;

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

//PUT
exports.updateInstruction = (req, res) => {
  let instruction = new Instruction({
    _id: req.params.id,
    text: req.body.text,
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