const userBroker = require('../brokers/UserBroker');
const Controller = require('../utilities/Controller');
const request = require('request');

const mainRouter = new class MainRouter extends Controller {

    constructor() {
        super();
    }

    settings() {
        this.useRoute('/main');
        this.useParameters({"user": null});
    }

    defineRoutes() {
        this.useRoute('/main');
        this.get('/', this.renderMain);
        this.get('/fund', this.renderFund);
        this.post('/fund/transfer', this.transferFund);
        this.get('/accountSelection', this.renderAccountSelection);
        this.post('/fund/send', this.send);
        this.get('/113/api', this.receiveFund);
    }

    //todo replace users[0] with session user in useParameters

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
        const accountNumberFrom = fields.accF;
        const accountNumberTo = fields.accT;
        let amount = fields.amount;
        //todo make a validator
        if (accountNumberFrom !== accountNumberTo && amount) {
            userBroker.findUsers((users) => {
                const user = users[0];
                console.log('\n\nA transfer has been done!\n' + user._id + ' ' + accountNumberFrom + ' \nto ' + user._id + ' ' + accountNumberTo + ' \nof ' + amount + '$\n\n');
                amount = parseFloat(amount);
                userBroker.transferMoney(user._id, accountNumberFrom, user._id, accountNumberTo, amount, () => {
                    router.redirectBackward();
                });
            });
        }
    }

    //116
    //599112135041
    send(router) {
        userBroker.findUsers((users) => {
            const user = users[0];
            const fields = router.buildForm().getFields();
            const destinationBankId = fields.destinationBankId;
            const destinationAccountNumber = fields.destinationAccountNumber;
            const originAccountNumber = fields.originAccountNumber;
            const amount = parseFloat(fields.amount);
            const json = {
                sender: {
                    bank_id: '113',
                    account_number: originAccountNumber
                },
                receiver: {
                    bank_id: destinationBankId,
                    timestamp: Date.now(),
                    account_number: destinationAccountNumber
                },
                amount: amount,
                description: 'sent from ILeakable'
            };
            request.post('http://206.167.241.' + destinationBankId + '/api', json, (error, result, body) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(body);
                // if (body.status === 'success') {
                //     console.log('success');
                // } else {
                //     console.log(error)
                // }
                userBroker.updateMoney(user._id, originAccountNumber, amount, () => {
                    router.redirectBackward();
                });
            });
        });
    }

    receiveFund(router) {

    }

    renderAccountSelection(router) {
        userBroker.findUsers((users) => {
            router.render('accountSelection.pug', {'accounts': users[0].accounts});
        });
    }
};

module.exports = mainRouter.routes();
