const userBroker = require('../brokers/UserBroker');
const Controller = require('../utilities/Controller');

const indexRouter = new class IndexRouter extends Controller {

    defineRoutes() {
        this.get('/', this.renderLogin);
        this.get('/logout', this.logout);
        this.get('/api', this.receiveFund);
    }

    logout(router) {
        router.redirectLogin();
    }

    renderLogin(router) {
        router.redirectLogin();
    }

    receiveFund(router) {
        const fields = router.buildForm().getFields();
        const json = {'status': 'success'};
        router.send(json);
    }
};

module.exports = indexRouter.routes();
