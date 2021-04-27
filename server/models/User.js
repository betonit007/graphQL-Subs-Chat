const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    images: {
        type: Array,
        default: [
            {
                url: "",
                public_id: ""
            }
        ]
    },
    about: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
