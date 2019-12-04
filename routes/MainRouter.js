const userBroker = require('../brokers/UserBroker');
const Controller = require('../utilities/Controller');

const mainRouter = new class MainRouter extends Controller {

    constructor() {
        super();
    }

    defineRoutes() {
        this.get(this, '/', this.renderMain);
        this.get(this, '/fund', this.renderFunc);
        this.get(this, '/accountSelection', this.renderAccountSelection);
    }

    //todo replace users[0] with session user

    renderMain() {
        userBroker.findUsers((users) => {
            const user = users[0];
            this.render('main.pug', {'user': user, 'account': user.accounts[0]});
        });
    }

    renderFunc() {
        userBroker.findUsers((users) => {
            this.render('mainfund.pug', {'accounts': users[0].accounts});
        });
    }

    renderAccountSelection() {
        userBroker.findUsers((users) => {
            this.render('accountSelection.pug', {'accounts': users[0].accounts});
        });
    }
};

module.exports = mainRouter.routes();
