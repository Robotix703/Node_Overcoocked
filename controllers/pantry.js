const Pantry = require('../models/pantry');
const pantryInventory = require("../compute/pantryInventory");
const baseIngredient = require("../compute/base/ingredient");
const basePantry = require("../compute/base/pantry");

//POST
exports.writePantry = (req, res) => {
  const dateSplit = req.body.expirationDate.split("/");
  const year = dateSplit[2];
  const month = dateSplit[1];
  const day = dateSplit[0];

  const pantry = new Pantry({
    ingredientID: req.body.ingredientID,
    quantity: req.body.quantity,
    expirationDate: Date(year, month, day)
  });

  pantry.save()
    .then(result => {
      res.status(201).json({ id: result._id, pantry });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.writePantryByIngredientName = async (req, res) => {
  let ingredientID = await baseIngredient.getIngredientByName(req.body.ingredientName);

  const pantry = new Pantry({
    ingredientID: ingredientID._id,
    quantity: req.body.quantity,
    expirationDate: Date(req.body.expirationDate)
  });

  pantry.save()
    .then(result => {
      res.status(201).json({ id: result._id, pantry });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//GET
exports.readPantries = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const pantryQuery = Pantry.find();
  let fetchedPantries;

  if (pageSize && currentPage) {
    pantryQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  pantryQuery
    .then(documents => {
      fetchedPantries = documents;
      return Pantry.count();
    })
    .then(count => {
      res.status(200).json({ pantries: fetchedPantries, pantryCount: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.quantityLeft = (req, res) => {
  const ingredientID = req.query.ingredientID;

  let pantryQuery = Pantry.find({ingredientID: ingredientID});
  let fetchedPantries;

  pantryQuery
    .then(documents => {
      fetchedPantries = [...documents];
      let sum = 0;
      fetchedPantries.forEach((e) => {
        sum += e.quantity;
      })
      res.status(200).json({quantityLeft: sum});
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getNearestExpirationDate = (req, res) => {
  const ingredientID = req.query.ingredientID;

  let pantryQuery = Pantry.find({ingredientID: ingredientID});
  let fetchedPantries;

  pantryQuery
    .then(documents => {
      fetchedPantries = [...documents];
      let nearestExpirationDate = new Date();
      nearestExpirationDate.setFullYear(nearestExpirationDate.getFullYear() + 1);
      fetchedPantries.forEach((e) => {
        if(e.expirationDate < nearestExpirationDate) nearestExpirationDate = e.expirationDate;
      })
      res.status(200).json({nearestExpirationDate: nearestExpirationDate});
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getFullPantryInventory = async (req, res) => {
  let fullInventory = await pantryInventory.getFullInventory();

  res.status(200).json(fullInventory);
}
exports.getPantryByID = async (req, res) => {
  let pantry = await basePantry.getPantryByID(req.query.pantryID);
  let ingredientName = await baseIngredient.getIngredientNameByID(pantry.ingredientID);

  res.status(200).json({
    _id: pantry._id,
    ingredientID: pantry.ingredientID,
    quantity: pantry.quantity,
    expirationDate: pantry.expirationDate || null,
    ingredientName: ingredientName
  });
}

//PUT
exports.updatePantry = (req, res) => {
  let pantry = new Pantry({
    _id: req.params.id,
    ingredientID: req.body.ingredientID,
    quantity: req.body.quantity,
    expirationDate: req.body.expirationDate
  });

  Pantry.updateOne({ _id: req.params.id }, pantry)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json(recipe);
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
exports.deletePantry = (req, res) => {
  Pantry.deleteOne({ _id: req.params.id })
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