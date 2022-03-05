const router = require('express').Router();
const {isUser, isGuest} = require('../middleware/guards');
const {register, login} = require('../services/user');
const mapErrors = require('../util/mappers');

router.get('/register', (req, res) => {
    res.render('register', {'title': 'Register Page'});
});

router.post('/register', isGuest(), async (req,res) => {
    try {

        if (req.body.password.length < 5) {
            throw new Error('Password must be at least 5 characters');
        }

        if(req.body.password === '' || req.body.password !== req.body.repass) {
            throw new Error('Passwords don\'t match or empty');
        }

        const user = await register(req.body.email, req.body.password, req.body.description);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        // console.log(err);
        const errors = mapErrors(err);
        res.render('register', {'title': 'Register Page', data: {email: req.body.email, description: req.body.description}, errors});
    }
});

router.get('/login', (req,res) => {
    res.render('login', {'title': 'Login Page'});
});



router.post('/login', async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);
        req.session.user = user;
        res.redirect('/');
    } catch (err) {
        // console.log(err);
        const errors = mapErrors(err);
        res.render('login', {'title': 'Login Page', data: {email: req.body.email}, errors});
    }
});

router.get('/logout', (req, res) => {
    delete req.session.user;
    res.redirect('/');
});

module.exports = router;