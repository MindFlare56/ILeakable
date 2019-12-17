const userBroker = require('../brokers/UserBroker');
const Controller = require('../utilities/Controller');
const request = require('request');

const mainRouter = new class MainRouter extends Controller {

    settings() {
        this.useRenderRoute('/main');
    }

    defineRoutes() {
        this.get('/', this.renderMain);
        this.get('/fund', this.renderFund);
        this.post('/fund/transfer', this.transferFund);
        this.get('/accountSelection', this.renderAccountSelection);
        this.post('/fund/send', this.send);
    }

    renderMain(router) {
        const user = router.getUser();
        router.render('main.pug', {'user': user, 'account': user.accounts[0]});
    }

    renderFund(router) {
        const user = router.getUser();
        router.render('mainfund.pug', {'accounts': user.accounts});
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
                    account_number: destinationAccountNumber
                },
                amount: amount,
                timestamp: Date.now(),
                description: 'sent from ILeakable'
            };
            request.post('http://206.167.241.' + destinationBankId + '/api', json, (error, result, body) => {
                console.log('\n\n\N\N\n');
                console.log(body);
                console.log('\n\n\N\N\n');
                if (error) {
                    console.log(error);
                    return;
                }
                console.log(body);
                if (body.status === 'success') {
                    console.log('success');
                } else {
                    console.log(error)
                }
                userBroker.updateMoney(user._id, originAccountNumber, -amount, () => {
                    router.redirectBackward();
                });
            });
        });
    }

    renderAccountSelection(router) {
        userBroker.findUsers((users) => {
            router.render('accountSelection.pug', {'accounts': users[0].accounts});
        });
    }
};

module.exports = mainRouter.routes();
