const express = require('express')
const router = express.Router();
const { createSchool, schoolLogin, getSchool } = require("../controller/schoolController")
const { authenticate } = require("../auth/auth");

//register school
router.post("/registration", createSchool)

//login  school
router.post("/login", schoolLogin)

//get school data 
router.get("/school/:schoolId/schoolData", authenticate, getSchool)


module.exports = router
