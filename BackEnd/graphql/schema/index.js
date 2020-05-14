const { buildSchema } = require('graphql')


module.exports = buildSchema(`
type Project {
    _id: ID!
    title: String!
    description: String!
    creator: User!
}

type User {
    _id: ID!
    email: String!
    password: String
    createdProjects: [Project!]
}

type Task{
    _id: ID!
    title: String!
    description: String!
}

input UserInput {
    email: String!
    password: String!
}
input ProjectInput {
    title: String!
    description: String!
}

type RootQuery {
    projects: [Project!]!
}

type RootMutation {
    createProject(projectInput: ProjectInput): Project
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}`)