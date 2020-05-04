const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require('graphql')

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
            const project =  {
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
//task schema
//checklist schema 
//checklist item schema
app.listen(4000); 