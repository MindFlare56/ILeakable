const userBroker = require('../brokers/UserBroker');
const Controller = require('../utilities/Controller');

const mainRouter = new class MainRouter extends Controller {

    constructor() {
        super('/login');
    }

    defineRoutes() {
        this.useRoute('/main');
        this.get('/', this.renderMain);
        this.get('/fund', this.renderFund);
        this.post('/fund/transfer', this.transferFund);
        this.get('/accountSelection', this.renderAccountSelection);
    }

    //todo replace users[0] with session user

    renderMain(router) {
        userBroker.findUsers((users) => {
            const user = users[0];
            router.render('main.pug', {'user': user, 'account': user.accounts[0]});
        });
    }

    renderFund(router) {
        userBroker.findUsers((users) => {
            router.render('mainfund.pug', {'accounts': users[0].accounts});
        });
    }

    transferFund(router) {
        const fields = router.buildForm().getFields();
        router.send(fields.mail);
        //userBroker.transferMoney();
    }

    renderAccountSelection(router) {
        userBroker.findUsers((users) => {
            router.render('accountSelection.pug', {'accounts': users[0].accounts});
        });
    }
};

module.exports = mainRouter.routes();
