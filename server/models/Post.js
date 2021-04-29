const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: 'Content is required'
    },
    image: {
        url: String,
        public_id: String
    },
    postedBy: {
        type: mongoose.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)