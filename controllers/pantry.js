const Pantry = require('./../models/pantry');

//POST
exports.writePantry = (req, res) => {
  const pantry = new Pantry({
    ingredientID: req.body.ingredientID,
    quantity: req.body.quantity,
    expirationDate: req.body.expirationDate
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