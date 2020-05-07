const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require('graphql')
const mongoose = require('mongoose');
const app = express();

const projects = [];

app.use(bodyParser.json());


//project schema
app.use('/graphql', graphQLHttp({
    schema: buildSchema(`
        type Project {
            _id: ID!
            title: String!
            description: String!
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
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        projects: () => {
            return projects
        },
        createProject: (args) => {
            const project = {
                _id: Math.random().toString(),
                title: args.projectInput.title,
                description: args.projectInput.description
            }
            projects.push(project)
            return project
        }
    },
    graphiql: true
}))

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    app.listen(4000); 
    console.log("Mongo started")
}).catch(err => {
    console.log(process.env.MONGO_URI)
    console.log(err)
})

//task schema
//checklist schema 
//checklist item schema
