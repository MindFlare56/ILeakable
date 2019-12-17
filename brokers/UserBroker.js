const Broker = require('../utilities/Broker');

module.exports = new class UserBroker extends Broker {

    constructor() {
        super();
        this.useDatabase('ILeak');
        this.useTable('users');
    }

    findByAuth(mail, onResult) {
        this.findSingle({ 'mail': mail }, onResult);
    }

    findByAccount(accountNumber) {
        this.findSingle({'accounts.number': accountNumber}, () => {

        })
    }

    insertUser(mail, firstName, lastName, hash, accounts, onResult) {
        const user = {
            'mail': mail,
            'firstName': firstName,
            'lastName': lastName,
            'password': hash,
            'accounts': accounts
        };
        this.insertOne(user, onResult)
    }

    findUsers(onResult) {
        this.findAll(onResult);
    }

    transferMoney(userIdFrom, accountNumberFrom, userIdTo, accountNumberTo, amount, onResult) {
        this.updateMoney(userIdFrom, accountNumberFrom, -amount, () => {
            this.updateMoney(userIdTo, accountNumberTo, amount, onResult);
        });
    }

    updateMoney(userId, accountNumber, amount, onResult) {
        this.updateWhere({"_id": userId, "accounts.number": accountNumber},{$inc: {"accounts.$.money": amount}}, onResult);
    }

    findUserById(id, onResult) {
        this.findSingle({"_id": id}, onResult);
    }
};