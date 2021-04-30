const { gql } = require('apollo-server-express')

module.exports = gql`
  type Post {
    _id: ID!
    content: String!
    description: String!
    image: Image!
    postedBy: User
  } 
  
  type Query {
    allPosts: [Post!]!
    postsByUser: [Post!]!
    singlePost(postId: String!):Post!
  }

  input PostCreateInput {
    content: String!
    image: ImageInput
  }

  input PostUpdateInput {
    _id: String!
    content: String!
    image: ImageInput
  }

  type Mutation {
    postCreate(input: PostCreateInput!): Post!
    postUpdate(input: PostUpdateInput!): Post!
    postDelete(postId: String!): Post!
  }

  type Subscription {
    postMade: Post!
  }
`