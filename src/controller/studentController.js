const { findOneAndUpdate } = require("../models/schoolModel");
const studModel = require("../models/studModel")

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

const createStudent = async function (req, res) {
    try {
        let data = req.body
        let { schoolId, firstName, lastName } = data

        //===== validate body ======//
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" });
        }

        //=========== authorization  ==================
        if (schoolId != req.schoolDetail)
            return res.status(403).send({ status: false, message: "Not Authourised to create data " })




        //===== validate firstName ======//
        if (!isValidData(firstName)) {
            return res.status(400).send({ status: false, message: "please enter student first Name" });
        }
        if (!/^\s*[a-zA-Z ]{2,}\s*$/.test(firstName)) {
            return res.status(400).send({
                status: false, message: `Heyyy....! ${firstName} is not a valid first name`,
            });
        }
        data.firstName = firstName.trim().split(" ").filter((word) => word).join("")

        //===== validate lastName ======//
        if (!isValidData(firstName)) {
            return res.status(400).send({ status: false, message: "please enter student last Name" });
        }
        if (!/^\s*[a-zA-Z ]{2,}\s*$/.test(lastName)) {
            return res.status(400).send({
                status: false, message: `Heyyy....! ${lastName} is not a valid last name`,
            });
        }
        data.lastName = lastName.trim().split(" ").filter((word) => word).join("");


        //checking for dupl
        const searchStudent = await studModel.find({ $and: [{ firstName: data.firstName }, { lastName: data.lastName }] })
        console.log(searchStudent.length);


        if (searchStudent.length > 0) {
            return res.status(409).send({ status: false, message: "student already add" })
        }
        const create = await studModel.create(data)
        return res.status(201).send({ status: true, message: "success", data: create })
    } catch (err) {

        return res.status(500).send(message = err.message)
    }
}


// addSubject
const addorUpdateSubject = async function (req, res) {

    try {
        const studentId = req.params.studentId
        const schoolId = req.params.schoolId
        const data = req.body

        //===== validate body ======//
        if (!isValidRequestBody(data)) {

            return res.status(400).send({ status: false, message: "Body cannot be empty" });
        }

        // =========== authorization  =================

        if (schoolId != req.schoolDetail)
            return res.status(403).send({ status: false, message: "Not Authourised to add subject " })

        const findStudent = await studModel.findOne({ _id: studentId })
        if (!findStudent) {
            console.log("student not found")
            return res.status(404).send({ status: false, message: "Student Not Found" });
        }
        let subjectalreadyAdded = []
        for (let pair of findStudent.subject) {
            subjectalreadyAdded.push(pair.subjectName)

        }
        let flag = false;
        let subj = ""
        for (const item in subjectalreadyAdded) {
            if (subjectalreadyAdded[item] == data.subjectName) {
                flag = true
                subj = subjectalreadyAdded[item]
            }
        }
        if (flag === true) {
            for (let pair of findStudent.subject) {
                if (pair.subjectName === subj) {
                    pair.marks += data.marks
                }
            }
        } else {
            findStudent.subject.push(data)
        }

        const updateSubject = await studModel.findOneAndUpdate({ _id: studentId }, findStudent, { new: true })

        res.status(200).send({ status: true, message: 'marks updated successfully.', data: updateSubject });

    } catch (err) {
        return res.status(500).send({ message: err.message })
    }

}

// get students
const getAllStudents = async function (req, res) {

    try {
        const schoolId = req.params.schoolId
        // =========== authorization  ==================
        // console.log(schoolId, req.schoolDetail);

        if (schoolId != req.schoolDetail)
            return res.status(403).send({ status: false, message: "Not Authourised to add subject " })

        const allData = await studModel.find({ $and: [{ schoolId: schoolId }, { isDeleted: false }] })

        if (!allData) {
            return res.status(404).send({ status: false, message: "Student Not  found" })
        }
        res.status(200).send({ status: true, message: "student profile details", data: allData })

    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

const deleteStudent = async function (req, res) {
    const schoolId = req.params.schoolId
    const studentId = req.params.studentId
    try {
        // =========== authorization  ==================
        if (schoolId != req.schoolDetail)
            return res.status(403).send({ status: false, message: "Not Authourised to add subject " })

        if (!schoolId) {
            return res.status(400).send({ status: false, message: "please enter School Id" });
        }
        if (!studentId) {
            return res.status(400).send({ status: false, message: "please enter student Id " });
        }

        const findStudentInDB = await studModel.findById(studentId)

        // console.log(findStudentInDB.isDeleted);

        if (!findStudentInDB || findStudentInDB.isDeleted === true) {
            return res.status(404).send({ status: false, message: " Student Not Found" });
        }
        findStudentInDB.isDeleted = true

        const deleteStu = await studModel.findOneAndUpdate({ _id: studentId }, findStudentInDB, { new: true })
        return res.status(203).send({ status: true, message: "Student deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { createStudent, addorUpdateSubject, getAllStudents, deleteStudent }