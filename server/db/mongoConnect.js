const mongoose = require('mongoose')

exports.db = async () => {
    try {
        const success = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log(`Connected to Mongo Atlas`)
    } catch (error) {
        console.log(error)
    }
}