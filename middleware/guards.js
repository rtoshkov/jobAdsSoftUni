function isUser(){
    return function (req, res, next) {
        if (req.session.user){
            next();
        } else {
            res.redirect('/login');
        }
    };
}

function isGuest() {
    return function (req,res,next){
        if (req.session.user) {
            res.redirect('/');
        } else {
            next();
        }
    };
}

function AddUserVariable() {
    return function (req,res,next){
        res.locals.hasUser = false;
        if (req.session.user) {
            res.locals.hasUser = true;
            res.locals.userEmail = req.session.user.email;
        }
        next();
    };
}

module.exports = {
    isUser,
    isGuest,
    AddUserVariable,
}