const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({
    schoolId: {
        type: ObjectId,
        ref: 'School',
        required: true,
        unique: true
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
    subject: {
        subjectId: {
            type: ObjectId,
            ref: 'Subject',
            unique: true
        },
    }
}, { timestamps: true })

module.exports = mongoose.model("student", studentSchema)