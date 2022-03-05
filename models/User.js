const { Schema, model, Types: {ObjectId} } = require('mongoose');



const userSchema = new Schema({
    email: {
        type: String,
        validate: {
            validator: function (value) {
                let pattern = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/
                return pattern.test(value);
            },
            message: 'Email not correct'
        }
    },
    description: {type: String, maxLength: [40, 'The description could not be more than 40 characters'], required:[true, 'Need description']},
    hashedPassword: {type: String, required: true},
    myAds: {type: [ObjectId], ref: 'Ad', default: []},
});

userSchema.index({email: 1}, {
    unique: true,
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;

