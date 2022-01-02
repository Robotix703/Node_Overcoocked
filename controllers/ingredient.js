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