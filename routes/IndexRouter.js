const Controller = require('../utilities/Controller');

const indexRouter = new class IndexRouter extends Controller {

    #router;

    constructor() {
        super();
    }

    defineRoutes() {
       this.get('/', this.renderLogin);
    }

    renderLogin(router) {
        router.redirect('/login');
    }
};

module.exports = indexRouter.routes();
