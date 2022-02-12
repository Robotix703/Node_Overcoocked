const Ingredient = require('../models/ingredient');
const baseIngredient = require("../compute/base/ingredient");

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

//POST
exports.writeIngredient = (req, res) => {
  const url = protocol + '://' + req.get("host");

  const ingredient = new Ingredient({
    name: req.body.name,
    imagePath: url + "/images/" + req.file.filename,
    consumable: req.body.consumable,
    category: req.body.category,
    unitOfMeasure: req.body.unitOfMeasure,
    shelfLife: req.body.shelfLife ? req.body.shelfLife : undefined,
    freezable: req.body.freezable
  });

  ingredient.save()
    .then(result => {
      res.status(201).json({ id: result._id, ingredient });
    })
    .catch(error => {
      res.status(500).json({
        message: error
      })
    });
}

//GET
exports.readIngredients = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const ingredientQuery = Ingredient.find();
  let fetchedIngredients = [];

  if (pageSize && currentPage) {
    ingredientQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  ingredientQuery
    .then(documents => {
      fetchedIngredients = documents;
      return Ingredient.count();
    })
    .then(count => {
      res.status(200).json({ ingredients: fetchedIngredients, ingredientCount: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.consumableID = (req, res) => {
  Ingredient.find({ consumable: true })
    .then(documents => {
      res.status(200).json({ IngredientsID: documents.map(e => e._id), count: documents.length });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.searchByName = (req, res) => {
  let fetchedIngredients = [];

  Ingredient.find({ 'name': { "$regex": req.query.name, "$options": "i" } })
    .then(documents => {
      fetchedIngredients = documents;
      return Ingredient.count();
    })
    .then(count => {
      res.status(200).json({ ingredients: fetchedIngredients, ingredientCount: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getIngredientByID = async (req, res) => {
  baseIngredient.getIngredientByID(req.query.ingredientID)
    .then((ingredient) => {
      res.status(200).json(ingredient);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getAllIngredientsName = async (req, res) => {
  baseIngredient.getAllIngredientsName()
    .then((ingredientsName) => {
      res.status(200).json(ingredientsName);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.filteredIngredients = async (req, res) => {
  baseIngredient.getFilteredIngredient(req.query.category)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//PUT
exports.editIngredient = (req, res) => {
  baseIngredient.updateIngredient(
    req.params.id,
    req.body.name,
    req.body.consumable,
    req.body.category,
    req.body.unitOfMeasure,
    req.body.shelfLife ?? -1,
    req.body.freezable
  )
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ status: "OK" });
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
exports.deleteIngredient = (req, res) => {
  Ingredient.deleteOne({ _id: req.params.id })
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