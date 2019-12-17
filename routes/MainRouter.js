const userBroker = require('../brokers/UserBroker');
const rule = require('../utilities/Rule');
const Controller = require('../utilities/Controller');
const request = require('request');

const router = new class MainRouter extends Controller {

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
        validateAmount(amount);
        if (!router.hasError()) {
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
            validateAmount(fields.amount);
            validateBankId(fields.destinationBankId);
            if (!router.hasError()) {
                const amount = parseFloat(fields.amount);
                const json = this.#requestJson(originAccountNumber, destinationBankId, destinationAccountNumber, amount);
                request.post('http://206.167.241.' + destinationBankId + '/api', json, (error, result, body) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    if (body.status === 'success') {
                        console.log('success');
                    } else {
                        console.log(error);
                        return;
                    }
                    userBroker.updateMoney(user._id, originAccountNumber, -amount, () => {
                        router.redirectBackward();
                    });
                });
            }
        });
    }

    #requestJson = function(originAccountNumber, destinationBankId, destinationAccountNumber, amount) {
        return {
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
        }
    };

    renderAccountSelection(router) {
        userBroker.findUsers((users) => {
            router.render('accountSelection.pug', {'accounts': users[0].accounts});
        });
    }
};

function validateAmount(amount) {
    if (!rule.decimal(amount)) {
        router.addError('Amount must be a positive decimal number');
    }
}

function validateBankId(destinationBankId) {
    if (!rule.isInRange(destinationBankId, 110, 130)) {
        router.addError('Invalid bank id');
    }
}

module.exports = router.routes();
