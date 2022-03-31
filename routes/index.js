var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
var Student = require("../models/student");
const { DateTime } = require("luxon");

//var student_controller = require("../controllers/studentController");

router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/register", function (req, res, next) {
  res.render("student_form");
});
router.post("/register", [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),
  body("email").isEmail().withMessage("Invalid email"),
  body("dob", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("phone")
    .trim()
    .isLength(10)
    .escape()
    .withMessage("Phone no is not of 10 digits")
    .isNumeric()
    .withMessage("Invalid phone-no"),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("student_form", {
        student: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Create Student object with escaped and trimmed data.
      var student = new Student({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        dob: DateTime.fromJSDate(req.body.dob).toLocaleString(
          DateTime.DATE_MED
        ),
        gender: req.body.gender,
      });
      student.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new author record.
        res.redirect("/success");
      });
    }
  },
]);

router.get("/success", (req, res, next) => res.render("success"));
module.exports = router;
