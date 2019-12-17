const userBroker = require('../brokers/UserBroker');
const date = require('dateformat');
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
        let result = {'status': 'error'};
        if (fields.amount > 0) {
            const user = router.getUser();
            userBroker.updateMoney(user._id, user.accounts[0].number, fields.amount, () => {
                result = {'status': 'success'};
                userBroker.insertTransaction(createTransaction(fields, user))
            })
        }
        router.send(result);
    }
};

function createTransaction(fields, user) {
    return {
        'hour': date('hh TT'),
        'date': date('yyyy/mm/dd'),
        'operation': 'Api received fund',
        'accountName': user.accounts[0].name,
        'description': 'Got some money',
        'amount': parseInt(fields.amount),
        'balance': user.accounts[0].money,
        'type': 'deposit'
    };
}

module.exports = indexRouter.routes();
