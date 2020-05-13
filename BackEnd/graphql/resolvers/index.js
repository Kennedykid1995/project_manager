const bcrypt = require('bcryptjs');
const Project = require("../../models/projects");
const User = require("../../models/user");

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { ...user._doc, id: user.id, createdProject: projects.bind(this, user._doc.createdProjects) };
    } catch (err) {
        throw err
    }
}

const projects = async projectId => {
    try {
        const projects = await Project.find({ _id: { $in: projectId } })
        projects.map(project => {
            return {
                ...project.doc,
                _id: event.id,
                creator: user.bind(this, project.creator)
            };
        })
        return projects.map(...project)
    } catch (err) {
        throw err
    }
}


module.exports = {
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
                createdProject = { ...result._doc, _id: result._doc._id.toString(), creator: user.bind(this, result._doc.creator) }
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
}