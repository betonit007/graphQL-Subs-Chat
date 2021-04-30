const { gql } = require('apollo-server-express')
//const { authCheck } = require('../helpers/auth')
const Post = require('../models/Post')
const User = require('../models/User')

const NEW_POST = "NEW_POST"
//mutation for creation of a post
const postCreate = async (parent, args, { req, pubsub }) => {      //parent mutation type

    if (args.input.content.trim() === "") throw new Error('Content is required')
    //const currentUser = await authCheck(req)

    const currentUser = req.headers.email
    const currentUserMongoId = await User.findOne({
        email: currentUser
    })
    //console.log(currentUserMongoId)
    let newPost = await new Post({
        ...args.input, //should contain most of the required info for new Post
        postedBy: currentUserMongoId
    }).save()

    newPost.populate("postedBy", "_id username")
    console.log('pubsub within postCreate resolver', pubsub)
    pubsub.publish("NEW_POST", { postMade: newPost })

    return newPost
}

const allPosts = async (parent, args) => {
    return await Post.find({}).populate('postedBy', 'username _id').sort({ createdAt: -1 })
}

const postsByUser = async (parent, args, { req }) => {

    //const currentUser = await authCheck(req)
    const currentUser = req.body.email
    const currentUserMongoID = await User.findOne({
        email: currentUser.email
    })

    return await Post.find({ postedBy: currentUserMongoID }).populate('postedBy', "_id username").sort({ createdAt: -1 })
}

const postUpdate = async (parent, args, { req }) => {
    //post can only be updated by the User who created it.
    //const currentUser = await authCheck(req)
    const currentUser = req.body.email
    //validate that we have content for post
    if (args.input.content.trim() === "") throw new Error('Content is required')
    //get current user mongo id based on their email
    const currentUserMongoId = await User.findOne({ email: currentUser.email })
    //get post to update
    const postToUpdate = await Post.findById({ _id: args.input._id })

    if (currentUserMongoId._id.toString() !== postToUpdate.postedBy_id.toString()) throw new Error('Not authorized to update post')

    let updatedPost = await Post.findByIdAndUpdate(args.input._id, { ...args.input }, { new: true }) //new: true returns updated post

    return updatedPost
}

const singlePost = async (parent, args) => {
    return await Post.findById({ _id: args.postId }).populate('postedBy', '_id username')
}

const postDelete = async (parent, args, { req }) => {

    //const currentUser = await authCheck(req)
    const currentUser = req.body.email
    const currentUserMongoId = await User.findOne({ email: currentUser.email })
    const postToDelete = await Post.findById({ _id: args.postId })

    if (currentUserMongoId._id.toString() !== postToDelete.postedBy.toString()) throw new Error('Not authorized to delete post')

    const deletedPost = await Post.findByIdAndDelete({ _id: args.postId })

    return deletedPost
}

const postMade = {
    subscribe: () => pubsub.asyncIterator(["NEW_POST"])
}


module.exports = {
    Query: {
        postsByUser,
        allPosts,
        singlePost
    },
    Mutation: {
        postCreate,
        postUpdate,
        postDelete
    }
}