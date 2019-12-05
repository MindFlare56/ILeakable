const Controller = require('../utilities/Controller');

const indexRouter = new class IndexRouter extends Controller {

    #router;

    constructor() {
        super();
    }

    defineRoutes() {
       this.get('/', this.renderLogin);
       this.get('/getSession', this.getSession);
       this.get('/setSession', this.setSession);
    }

    renderLogin(router) {
        router.redirect('/login');
    }

    getSession(router) {
        router.send(req.session.user);
        router.send('awesome');
    }

    setSession(router) {
        router.session.user = 'admin';
        router.send('done');
    }
};

module.exports = indexRouter.routes();
