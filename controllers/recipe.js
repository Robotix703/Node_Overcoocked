const Recipe = require('./../models/recipe');

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

//POST
exports.writeRecipe = (req, res) => {
  const url = protocol + '://' + req.get("host");

  const recipe = new Recipe({
    title: req.body.title,
    instructionsID: req.body.instructionsID,
    numberOfLunch: req.body.numberOfLunch,
    imagePath: url + "/images/recipes/" + req.file.filename
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
  let fetchedRecipes;

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
      res.status(200).json({ recipes: fetchedRecipes, recipeCount: count });
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

//PUT
exports.updateRecipe = (req, res) => {
  let recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    instructionsID: req.body.instructionsID,
    numberOfLunch: req.body.numberOfLunch,
    imagePath: req.body.imagePath
  });

  Recipe.updateOne({ _id: req.params.id }, recipe)
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