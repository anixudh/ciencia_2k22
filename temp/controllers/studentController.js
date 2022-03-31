var Student = require("../../models/student");

exports.index = function (req, res, next) {
  console.log("Hi");
  res.render("index", { error: err, data: results });
};
// Display list of all Authors.
exports.student_list = function (req, res) {
  res.send("NOT IMPLEMENTED: Author list");
};

// Display detail page for a specific Author.
exports.student_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Author detail: " + req.params.id);
};

// Display Author create form on GET.
exports.student_create_get = function (req, res) {
  res.render("student_form");
};

// Handle Author create on POST.
exports.student_create_post = function (req, res) {};
