const moment = require('moment');

const Recipe = require('./../models/recipe');
const baseRecipe = require("../compute/base/recipe");
const baseMeal = require("../compute/base/meal");
const handleRecipe = require("../compute/handleRecipe");

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

//POST
exports.writeRecipe = (req, res) => {
  const url = protocol + '://' + req.get("host");

  const recipe = new Recipe({
    title: req.body.title,
    numberOfLunch: req.body.numberOfLunch,
    imagePath: url + "/images/" + req.file.filename,
    category: req.body.category,
    duration: req.body.duration,
    score: req.body.score ?? undefined,
    lastCooked: undefined
  });

  recipe.save()
    .then(result => {
      res.status(201).json({ id: result._id, recipe });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//GET
exports.readRecipes = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const recipeQuery = Recipe.find();
  let fetchedRecipes = [];

  if (pageSize && currentPage) {
    recipeQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  recipeQuery
    .then(documents => {
      fetchedRecipes = documents;
      return Recipe.count();
    })
    .then(count => {
      res.status(200).json({ recipes: fetchedRecipes, count: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getRecipeByID = async (req, res) => {
  baseRecipe.getRecipeByID(req.query.recipeID).then((result) => {
    res.status(200).json(result);
  })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getFilteredRecipe = async (req, res) => {
  baseRecipe.filterRecipe(req.query.category, req.query.name, parseInt(req.query.pageSize), parseInt(req.query.currentPage))
    .then(documents => {
      fetchedRecipes = documents;
      return Recipe.count();
    })
    .then(count => {
      res.status(200).json({ recipes: fetchedRecipes, count: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getRecipeByName = async (req, res) => {
  baseRecipe.searchByName(req.query.name)
    .then(documents => {
      fetchedRecipes = documents;
      return Recipe.count();
    })
    .then(count => {
      res.status(200).json({ recipes: fetchedRecipes, count: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}
exports.getPrettyRecipe = async (req, res) => {

  let recipeID = "";
  if(req.query.recipeID){
    recipeID = req.query.recipeID;
  } else {
    if(req.query.mealID){
      let meal = await baseMeal.getMealByID(req.query.mealID);
      recipeID = meal.recipeID;
    }
  }

  handleRecipe.getPrettyRecipe(recipeID)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    res.status(500).json({
      errorMessage: error
    })
  });
}

//PUT
exports.updateRecipe = (req, res) => {
  baseRecipe.updateRecipe(
    req.params.id,
    req.body.title,
    req.body.numberOfLunch,
    req.body.imagePath,
    req.body.category,
    req.body.duration,
    req.body.score ?? undefined,
    req.body.lastCooked ? moment(req.body.expirationDate, "DD/MM/YYYY") : undefined
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
exports.deleteRecipe = (req, res) => {
  Recipe.deleteOne({ _id: req.params.id })
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