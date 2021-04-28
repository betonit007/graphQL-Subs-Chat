//const { authCheck } = require('../helpers/auth')
const User = require('../models/User')


const profile = async (parent, args, context) => {

    const { req, res } = context
    //const currentUser = await authCheck(req)
    return await User.findOne({ email: currentUser.email })

}

const publicProfile = async(parent, args, { req }) => {
  return await User.findOne({username: args.username})
}

const allUsers = async(parent, args, {req}) => await User.find({})


const userCreate = async (parent, args, { req }) => {
    const { username, email, password } = req.body.variables.input
    //const currentUser = await authCheck(req)
  
   // const user = await User.findOne({ email: currentUser.email })

    //return user ? user : 
     return new User({   // if user is in database return user, if not add user to database and then return
      email,
      username,
      password
    }).save()

}

const userUpdate = async(parent, args, {req}) => {

    //args contain the input from
    
    //const currentUser = await authCheck(req)
    //console.log(args.input)
    //findOneAndUpdate accepts 3 args: what to search by, the updated info and findally new: true returns updated info
    const updatedUser = await User.findOneAndUpdate({email: currentUser.email}, {...args.input}, {new:true})

    return updatedUser

}

module.exports = {
    Query: {
        //me: () => 'Hello JERSTER' //alternative way
        profile,
        publicProfile,
        allUsers
    },
    Mutation: {
        userCreate,
        userUpdate
    }
}