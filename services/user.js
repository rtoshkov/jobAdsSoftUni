const User = require('../models/User');
const {hash, compare} = require('bcrypt');




async function register(email, password, description){
    const existing = await getUserByEmail(email);
    // console.log(existing);

    if(existing){
        throw new Error('Email is taken');
    }

    const hashedPassword = await hash(password, 10);

    const user = new User({
        email: email,
        hashedPassword,
        description
    });

    await user.save();

    return user;
}



async function login(email,password){
    const user = await getUserByEmail(email);

    if(!user){
        throw new Error('Incorrect username or password');
    }

    const hashMatched = await compare(password, user.hashedPassword);

    if(!hashMatched){
        throw new Error('Incorrect username or password');
    }

    return user;
}




async function getUserByEmail(email){
    const user = await User.findOne({email: new RegExp(`^${email}$`, 'i')});

    return user;
}

async function getUserByString(email){
    const user = await User.findOne({email: new RegExp(`${email}`, 'i')}).populate('myAds').lean();

    return user;
}

module.exports = {
    login,
    register,
    getUserByEmail,
    getUserByString
}