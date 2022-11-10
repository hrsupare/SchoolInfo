const mongoose = require("mongoose")
const schoolSchema = new mongoose.Schema({
    SchoolName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    }

}, { timestamp: true })

module.exports = mongoose.model("school", schoolSchema)