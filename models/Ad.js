const {Schema, model, Types: {ObjectId}} = require('mongoose');

const adSchema = new Schema({
    headline: {type: String, minLength: [4, 'The headline should be at least 4 characters']},
    location: {type: String, minLength: [8, 'The location should be at least 8 characters']},
    name: {type: String, minLength: [3, 'The company name should be at least 3 characters']},
    description: {type: String, maxLength: [40, 'The description should not be more than 40 characters'],required:[true, 'Need description']},
    author: {type: ObjectId, ref: 'User'},
    applied: {type: [ObjectId], ref: 'User', default: []},
});


// adSchema.virtual('candidates').get(
//     function(){
//         return `${this.applied.length}`;
//     }
// )

const Ad = model('Ad', adSchema);

module.exports = Ad;