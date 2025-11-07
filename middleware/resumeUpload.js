const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/resumes"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
module.exports = require("multer")({ storage });
