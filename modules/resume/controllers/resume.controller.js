const getEmptyResume = require("../services/resume.schema");

exports.getBuilder = (req, res) => {
  const resume = getEmptyResume();
  res.render("builder", {
    resume,
    themes: ["modern", "minimal", "classy"]
  });
};

exports.getLanding = (req, res) => {
  const resume = getEmptyResume();
  res.render("builder", {
    resume,
    themes: ["modern", "minimal", "classy"]
  });
};
