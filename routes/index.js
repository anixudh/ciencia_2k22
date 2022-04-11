var express = require("express");
var router = express.Router();
const { body, validationResult } = require("express-validator");
var Student = require("../models/student");
const { DateTime } = require("luxon");
var Student = require("../models/student");
const te_events = require("../events/technical.json");
const nte_events = require("../events/non_technical.json");
const sp_events = require("../events/special.json");
//const { events } = require("../models/student");

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
  async (req, res, next) => {
    // Extract the validation errors from a request.
    let errors = validationResult(req);

    const query = await Student.exists({
      $or: [{ phone: req.body.phone }, { email: req.body.email }],
    });

    if (query) {
      errors = [
        {
          msg: "Phone No or Email already exists! Please register with different Phone No./Email",
        },
      ];

      res.render("student_form", {
        student: req.body,
        errors: errors,
      });
      return;
    } else if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("student_form", {
        student: req.body,
        errors: errors.array(),
      });
      return;
    } else {
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
        // Successful
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

router.get("/technical_events", (req, res, next) =>
  res.render("technical_events", {
    te_events: te_events,
  })
);
router.get("/non-technical_events", (req, res, next) =>
  res.render("non-technical_events", {
    nte_events: nte_events,
  })
);
router.get("/special_events", (req, res, next) =>
  res.render("special_events", {
    sp_events: sp_events,
  })
);
router.get("/paper_presentation", (req, res, next) =>
  res.render("paper_presentation")
);
router.get("/project_expo", (req, res, next) => res.render("project_expo"));

router.get("/auto_expo", (req, res, next) => res.render("autoexpo"));


let event = "";
router.get("/technical_events/:id", (req, res, next) => {
  let id = req.params.id;
  for (let te of te_events) {
    if (te.id == id) {
      event = te;
      break;
    }
  }
  res.render("event", {
    event: event,
  });
});

router.get("/non-technical_events/:id", (req, res, next) => {
  let id = req.params.id;
  for (let nte of nte_events) {
    if (nte.id == id) {
      event = nte;
      break;
    }
  }
  res.render("event", {
    event: event,
  });
});

router.get("/special_events/:id", (req, res, next) => {
  let id = req.params.id;
  for (let sp of sp_events) {
    if (sp.id == id) {
      event = sp;
      break;
    }
  }
  res.render("event", {
    event: event,
  });
});

let login= false;
router.get("/search", (req, res, next) =>

  res.render("search", {
      details: null,
      errors:null,
      login: login,
    })
  
);

router.post("/search", (req,res,next)=>{
  if(!login){
    login = req.body.username==process.env.username && req.body.password==process.env.password;
    if(!login){
      res.render("search",{
        details:null,
        errors: "Invalid username/password",
        login: login,
      })
    }
    else res.redirect("/search");
  }
  else{
    Student.findOne({uniqID: req.body.searchId}).exec((err,result)=>{
      if(err) return next(err);
      console.log(result);
      if(result==null){
        res.render("search",{
          details:null,
          errors: "Not found",
          login: login,
        })
      }
      else{
        res.render("search",{
          details:result,
          errors:null,
          login: login,
        })
      }
    })
  }
})

module.exports = router;
