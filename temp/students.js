var express = require("express");
var router = express.Router();

// Require controller modules.
var student_controller = require("./controllers/studentController");

// GET catalog home page.
router.get("/", student_controller.index);

// GET request for creating a student. NOTE This must come before routes that display student (uses id).
router.get("/student/create", student_controller.student_create_get);

// POST request for creating student.
router.post("/student/create", student_controller.student_create_post);

module.exports = router;
