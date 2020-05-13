const mogoose = require('mongoose'); 

const Schema = mongoose.Schema;

const checklistSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    status:{
        type: Boolean,
    }
})

module.exports = mongoose.model('Checklist', checklistSchema); 