const router = require('express').Router();
const {isUser, isGuest} = require('../middleware/guards');
const mapErrors = require('../util/mappers');
const {
    getAllAds,
    createAd,
    getAdByID,
    editAd,
    getNotPopulatedAdByID,
    deleteAdById,
    searchByEmail
} = require("../services/ad");
const {getUserByEmail, getUserByString} = require("../services/user");


router.get('/', async (req, res) => {
    const data = await getAllAds(true);

    data.forEach((e) => {
        e.candidates = e.applied.length;
    })

    res.render('home', {'title': 'Home Page', data});
});

router.get('/allAds', async (req, res) => {
    const data = await getAllAds();
    res.render('all-ads', {'title': 'All-Ads Page', data});
});

router.get('/create', isUser(), (req, res) => {
    res.render('createAd', {'title': 'Create Page'});
});

router.post('/create', isUser(), async (req, res) => {
    const data = {
        headline: req.body.headline,
        location: req.body.location,
        name: req.body.name,
        description: req.body.description,
        author: req.session.user._id,
    }

    try {
        const ad = await createAd(data);
        res.redirect('/allAds')
        let user = await getUserByEmail(req.session.user.email);
        user.myAds.push(ad._id);
        user.save();
    } catch (err) {

        const errors = mapErrors(err);
        res.render('createAd', {'title': 'Create Page', errors, data});
    }
});


router.get('/details/:id', async (req, res) => {
    try {
        const data = await getAdByID(req.params.id);
        // console.log(data);
        let isOwner = false;
        let isJoined = false;
        let applications = data.applied.length;

        if (req.session.user) {
            isOwner = req.session.user._id.toString() === data.author._id.toString();
        }

        if (req.session.user && data.applied) {
            isJoined = data.applied.some((e) => req.session.user._id.toString() === e._id.toString());
        }
        res.render('details', {'title': 'Details Page', data, isOwner, isJoined, applications})
    } catch (err) {
        const errors = mapErrors(err);
        // console.log(errors);
        res.render('details', {'title': 'Details Page', errors})
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        let data = await getAdByID(req.params.id);
        let isOwner = req.session.user._id.toString() === data.author._id.toString();

        if (isOwner) {
            res.render('edit', {'title': 'Edit Page', data});
        } else {
            throw new Error('Not Owner');
        }

    } catch (err) {
        const errors = mapErrors(err);
        res.render('home', {'title': 'Home Page', errors});
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    let data = {
        headline: req.body.headline,
        location: req.body.location,
        name: req.body.name,
        description: req.body.description,
    };
    try {
        await editAd(data, req.params.id);
        res.redirect(`/details/${req.params.id}`);

    } catch (err) {
        const errors = mapErrors(err);
        data._id = req.params.id;
        res.render('edit', {'title': 'Edit Page', data, errors});
    }
});

router.get('/join/:id', isUser(), async (req, res) => {
    try {
        let data = await getNotPopulatedAdByID(req.params.id);
        const isJoined = data.applied.some((e) => req.session.user._id.toString() === e._id.toString());
        if (isJoined) {
            throw new Error('Already applied');
        }
        data.applied.push(req.session.user._id)
        data.save();
        res.redirect(`/details/${req.params.id}`);
    } catch (err) {
        const errors = mapErrors(err);
        res.render('home', {'title': 'Home Page', errors});
    }
});

router.get('/delete/:id', isUser(), async (req, res) => {
    try {
        let data = await getNotPopulatedAdByID(req.params.id);
        let isOwner = req.session.user._id.toString() === data.author._id.toString();

        if (isOwner) {
            await deleteAdById(data._id);
            res.redirect('/allAds');
        } else {
            throw new Error('Not Owner');
        }

    } catch (err) {
        const errors = mapErrors(err);
        res.render('home', {'title': 'Home Page', errors});
    }

});

router.get('/search', isUser(), async (req, res) => {
    let data = false;
    let searching = false;
    let last = undefined;
    if (req.query.email) {
        searching = true;
        last = req.query.email
        data = await getUserByString(req.query.email);
        if (data) {
            data = data.myAds;
        }
    }
    res.render('search', {'title': 'Search', data, searching, last});
});


module.exports = router;