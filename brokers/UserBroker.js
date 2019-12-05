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

    insertUser(mail, firstName, lastName, hash, onResult) {
        const user = {
            'mail': mail,
            'firstName': firstName,
            'lastName': lastName,
            'password': hash
        };
        this.insertOne(user, onResult)
    }

    findUsers(onResult) {
        this.findAll(onResult);
    }

    transferMoney(userFrom, accountFrom, userTo, accountTo, amount, onResult) {
        this.updateMoney(userFrom, accountFrom, -amount, () => {
            this.updateMoney(userTo, accountTo, amount, onResult);
        });
    }

    updateMoney(user, accountName, amount, onResult) {
        this.updateWhere({"_id": user["_id"], "accounts.name": accountName},{$inc: {"accounts.$.money": amount}}, onResult);
    }

    findUserById(id, onResult) {
        this.findSingle({"_id": id}, onResult);
    }
};