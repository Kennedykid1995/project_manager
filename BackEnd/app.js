const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require("./graphql/schema/index");

const graphqlResolvers = require("./graphql/resolvers/index"); 

const app = express();

app.use(bodyParser.json());

//project schema
app.use('/graphql', graphQLHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
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
