const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const subjectSchema = new mongoose.Schema({
    studentId: {
        type: ObjectId,
        ref: 'Student',
        required: true,
        unique: true
    },
    subject: {
        type: String,
        require: true,
        trim: true
    },
    marks: {
        type: Number,
    },
}, { timestamps: true })

module.exports = mongoose.model("subject", subjectSchema)
