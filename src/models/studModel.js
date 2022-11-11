const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({
    schoolId: {
        type: ObjectId,
        ref: 'School'
    },
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    subject: [{
        subjectName: {
            type: String,
            trim: true
        },
        marks: {
            type: Number
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model("stud", studentSchema)
