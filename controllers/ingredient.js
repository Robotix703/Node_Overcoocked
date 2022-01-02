const Ingredient = require('./../models/ingredient');

const protocol = (process.env.NODE_ENV === "production") ? "https" : "http";

exports.writeIngredient = (req, res) => {
  const url = protocol + '://' + req.get("host");

  const ingredient = new Ingredient({
    name: req.body.name,
    imagePath: url + "/images/" + req.file.filename
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

exports.readIngredients = (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

  const ingredientQuery = Ingredient.find();
  let fetchedIngredients;

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

exports.editIngredient = (req, res) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }

  let ingredient = new Ingredient({
    _id: req.params.id,
    name: req.body.name,
    imagePath: imagePath
  });

  Ingredient.updateOne({ _id: req.params.id }, ingredient)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json(ingredient);
      } else {
        res.status(401).json({ message: "Pas d'autorisation" });
      }
    })
    .catch(error => {
      res.status(500).json({
        errorMessage: error
      })
    });
}

exports.deleteIngredient = (req, res) => {
  Ingredient.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.n > 0) {
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