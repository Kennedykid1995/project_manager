const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require('graphql')
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcryptjs');
const Project = require("./models/projects");
const User = require("./models/user");

app.use(bodyParser.json());

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return { ...user._doc, id: user.id, createdProject: projects.bind(this, user._doc.createdProjects) };
        })
        .catch(err => {
            throw err
        })
}

const projects = projectId => {
    return Project.find({ _id: { $in: projectId } })
        .then(projects => {
            return projects.map(project => {
                return { 
                    ...project.doc,
                     _id: event.id, 
                     creator: user.bind(this, project.creator) 
                    };
            })
        })
        .catch(err => {
            throw err
        })
}

//project schema
app.use('/graphql', graphQLHttp({
    schema: buildSchema(`
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
        }
    `),
    rootValue: {
        projects: () => {
            return Project.find()
                .then(result => {
                    return result.map(project => {
                        return {
                            ...project._doc,
                            _id: project.id,
                            creator: user.bind(this, project._doc.creator)
                        }
                    })
                }).catch(err => {
                    console.log(err)
                    throw err
                })
        },
        createProject: (args) => {
            const project = new Project({
                title: args.projectInput.title,
                description: args.projectInput.description,
                creator: '5eb99c11b94eb21a144336fe'
            })
            let createdProject;
            return project
                .save()
                .then(result => {
                    createdProject = { ...result._doc, _id: result._doc._id.toString() }
                    console.log(createdProject)
                    return User.findById('5eb99c11b94eb21a144336fe')
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User Not Found')
                    }
                    console.log(user)
                    user.createdProjects.push(project);
                    return user.save()
                })
                .then(result => {
                    return createdProject;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: args => {
            return User.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) {
                        throw new Error('User Exists Already')
                    }
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    })
                    return user.save()
                })
                .then(result => {
                    return { ...result._doc, password: null, _id: result.id };
                })
                .catch(err => {
                    throw err
                })
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
