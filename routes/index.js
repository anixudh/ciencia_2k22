var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
var Student = require("../models/student");
const { DateTime } = require("luxon");

//var student_controller = require("../controllers/studentController");
function getUniqID(name, phone, dob) {
  n1 = name.split(" ").join().substring(0, 3).toUpperCase();
  n2 = phone.substring(7, 10);
  n3 = dob.split("-").join().substring(0, 2);
  return n1 + n3 + n2;
}
router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/register", function (req, res, next) {
  res.render("student_form", { errors: [] });
});

let uniqID = "";
router.post("/register", [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Name must be atleast 5 characters long.")
    .custom((value) => /^[a-zA-Z ]*$/.test(value))
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
      uniqID = getUniqID(
        req.body.name,
        req.body.phone,
        DateTime.fromJSDate(req.body.dob).toFormat("dd-MM-yyyy")
      );
      // Create Student object with escaped and trimmed data.
      var student = new Student({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        dob: DateTime.fromJSDate(req.body.dob).toFormat("dd-MM-yyyy"),
        gender: req.body.gender,
        uniqID: uniqID,
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

router.get("/success", (req, res, next) =>
  res.render("success", {
    uniqID: uniqID,
  })
);
module.exports = router;
