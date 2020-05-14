const bcrypt = require('bcryptjs');
const Project = require("../../models/projects");
const User = require("../../models/user");

const transformProject = project => {
    return {
        ...project.doc,
        _id: project.id,
        creator: user.bind(this, project.creator)
    };
}

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
        return projects.map(project => {
            return transformProject(project);
        })
    } catch (err) {
        throw err
    }
}

const singleProject = async projectId => {
    try {
        const project = await Event.findById(projectId);
        return transformProject(project);
    }catch(err){
        throw err
    }
}


module.exports = {
    projects: async () => {
        try{
        const result = await Project.find()
                return result.map(project => {
                    return transformProject(project); 
            })
        } catch(err) {
                console.log(err)
                throw err
            }
    },
    createProject: async (args) => {
        const project = new Project({
            title: args.projectInput.title,
            description: args.projectInput.description,
            creator: '5eb99c11b94eb21a144336fe'
        })
        let createdProject;
        try{
        const result = await project
            .save()
                createdProject = transformProject(result)
                console.log(createdProject)
                const user = await User.findById('5eb99c11b94eb21a144336fe')
                if (!user) {
                    throw new Error('User Not Found')
                }
                console.log(user)
                user.createdProjects.push(project);
                await user.save()
                return createdProject;
            } catch(err) {
                console.log(err);
                throw err;
            };
    },
    createUser: async args => {
        try{
        const existingUser = await User.findOne({ email: args.userInput.email })
                if (existingUser) {
                    throw new Error('User Exists Already')
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                const result = await user.save()
                return { ...result._doc, password: null, _id: result.id };
            } catch(err) {
                throw err
            }
    }
}