const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Mauvais type");
    if (isValid) {
      error = null;
    }

    cb(error, "images");
  },

  filename: (req, file, cb) => {
    let name = file.originalname.toLocaleLowerCase().split(' ').join('_');
    name = name.split('.')[0];

    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({ storage: storage }).single("image");
