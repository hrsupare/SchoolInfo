const schoolModel = require("../models/schoolModel")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const isValidRequestBody = function (requestBody) {
    if (!requestBody) return false;
    if (Object.keys(requestBody).length == 0) return false;
    return true;
};

const isValidData = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    return true;
};


const isValidObjectId = function (objectId) {
    if (mongoose.Types.ObjectId.isValid(objectId)) return true;
    return false;
}


//<<------------------------------------------- CREATE school ---------------------------------------------------->>
const createSchool = async function (req, res) {
    try {
        const data = req.body;
        const { SchoolName, email, password } = data


        //===== validate body ======//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" });
        }

        //===== validate SchoolName ======//
        if (!isValidData(SchoolName)) {
            return res.status(400).send({ status: false, message: "please enter your School Name" });
        }
        if (!/^\s*[a-zA-Z0-9., ]{2,}\s*$/.test(SchoolName)) {
            return res.status(400).send({
                status: false, message: `Heyyy....! ${SchoolName} is not a valid first name`,
            });
        }
        data.SchoolName = SchoolName.trim().split(" ").filter((word) => word).join(" ");


        //===== validate email ======//
        if (!isValidData(email)) {
            return res.status(400).send({ status: false, message: "please enter email" });
        }
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Heyyy....! ${email} is not a valid email` });
        }
        let checkEmail = await schoolModel.findOne({ email: email });
        if (checkEmail) {
            return res.status(400).send({
                status: false, message: `Heyyy....! there already exists an account registered with ${email} email address`,
            });
        }
        data.email = email.trim();

        //===== validate password ======//
        if (!isValidData(password)) {
            return res.status(400).send({
                status: false, message: "please enter Password....!",
            });
        }
        if (!/^[a-zA-Z0-9@*&$#!]{8,15}$/.test(password)) {
            return res.status(400).send({
                status: false, message: "please enter valid password min 8 or max 15 digit",
            });
        }

        //<----create a School document---->

        const schoolData = await schoolModel.create(data)
        return res.status(201).send({ status: true, message: 'Success', data: schoolData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


//==========================================login school=====================================//

let schoolLogin = async function (req, res) {
    try {
        let data = req.body;
        const { email, password } = data

        //===== validate body ======//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" });
        }

        //===== check email ======//
        if (!email || email.trim().length == 0) {
            return res.status(400).send({ status: false, message: "Please provide Email" });
        }

        //===== check password ======//
        if (!password || password.trim().length == 0) {
            return res.status(400).send({ status: false, message: "Please provide Password" });
        }
        let schoolData = await schoolModel.findOne({ email: email });
        console.log(schoolData)
        if (!schoolData) {
            return res.status(400).send({
                status: false, message: "Invalid Email",
            });
        }
        if (schoolData.password !== password) {
            return res.status(401).send({
                status: false, message: "Login failed!! password is incorrect."
            });
        }

        let schoolId = schoolData._id
        let token = jwt.sign(
            {
                schoolId: schoolId,
                assignment: "School",
            }, "dataSchool", { expiresIn: '7d' },

        );

        res.status(200).send({
            status: true, message: "school login successfull",
            data: { schoolId: schoolId, Token: token }
        });

    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};


//========================================== get School data =====================================//

const getSchool = async function (req, res) {
    try {
        let schoolId = req.params.schoolId
        if (!isValidObjectId(schoolId)) {
            return res.status(400).send({ status: false, message: " enter valid schoolId" });
        }

        if (schoolId != req.schoolDetail)
            return res.status(403).send({ status: false, message: "Not Authourised to get data " })

        const getschool = await schoolModel.findOne({ _id: schoolId })

        if (!getschool) {
            return res.status(404).send({ status: false, message: "no school found" })
        }
        res.status(200).send({ status: true, message: "school profile details", data: getschool })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }

}

module.exports = { createSchool, schoolLogin, getSchool }