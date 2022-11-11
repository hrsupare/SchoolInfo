const express = require('express')
const router = express.Router();
const { createSchool, schoolLogin, getSchool } = require("../controller/schoolController")
const { authenticate } = require("../auth/auth");
const { createStudent, addorUpdateSubject, getAllStudents, deleteStudent } = require("../controller/studentController")

//register school
router.post("/registration", createSchool)

//login  school
router.post("/login", schoolLogin)

//get school data 
router.get("/school/:schoolId/schoolData", authenticate, getSchool)

//create Student 
router.post("/school/createStudent", authenticate, createStudent)

//add Marks  and update marks 
router.put("/school/:schoolId/schoolData/:studentId", authenticate, addorUpdateSubject)

//view Student
router.get("/school/:schoolId/viewstudent", authenticate, getAllStudents)

//delete Student 
router.delete("/school/:schoolId/deletestudent/:studentId", authenticate, deleteStudent)

module.exports = router
