const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const {AddUserVariable} = require("../middleware/guards");

module.exports = (app) => {
    app.use(AddUserVariable());
    app.use(authController);
	app.use(homeController);
   app.all('*', (req,res)=> {
       res.render('404', {'title':'Not Found Page'});
   })
}
