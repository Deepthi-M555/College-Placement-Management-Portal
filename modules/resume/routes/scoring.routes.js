const router = require("express").Router();
const scoring = require("../controllers/scoring.controller");

router.post("/match", scoring.match);

module.exports = router;

