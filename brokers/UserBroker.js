const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const database = 'ILeak';
const table = 'users';

class UserBroker {

    findByAuth(mail, onResult) {
        findSingle({ 'mail': mail }, onResult);
    }

    insertUser(mail, firstName, lastName, hash, onResult) {
        const user = {
            'mail': mail,
            'firstName': firstName,
            'lastName': lastName,
            'password': hash
        };
        insertOne(user, onResult)
    }

    findUsers(onResult) {
        findAll(onResult);
    }

    transferMoney(userFrom, accountFrom, userTo, accountTo, amount, onResult) {
        this.updateMoney(userFrom, accountFrom, -amount, () => {
            this.updateMoney(userTo, accountTo, amount, onResult);
        });
    }

    updateMoney(user, accountName, amount, onResult) {
        updateWhere({"_id": user["_id"], "accounts.name": accountName},{$inc: {"accounts.$.money": amount}}, onResult);
    }

    findUserById(id, onResult) {
        findSingle({"_id": id}, onResult);
    }
}

//todo test
function update(query, onResult) {
    createConnection(database, (database) => {
        database.collection(table).update(query).toArray(function (error, result) {
            if (error) throw error;
            onResult(result);
            database.close;
        });
    }, onResult);
}

function updateWhere(filter, update, onResult) {
    createConnection(database, (database) => {
        database.collection(table).updateMany(filter, update, (error, result) => {
            if (error) throw error;
            onResult(result);
            database.close;
        });
    }, onResult);
}

function findAll(onResult) {
    createConnection(database, (database) => {
        database.collection(table).find({}).toArray(function (error, result) {
            if (error) throw error;
            onResult(result);
            database.close;
        });
    }, onResult);
}

function findSingle(query, onResult) {
    createConnection(database, (database) => {
        database.collection(table).find({}, {query}).toArray(function (error, result) {
            if (error) throw error;
            onResult(result[0]);
            database.close;
        });
    }, onResult);
}

function insertOne(object, onResult) {
    createConnection(database, (database) => {
        database.collection(table).insertOne(object, function(err, result) {
            if (err) throw err;
            onResult(result['ops'][0]);
            database.close;
        });
    }, onResult);
}

function createConnection(databaseName, onResult) {
    MongoClient.connect(url, {}, function (err, db) {
        if (err) throw err;
        const database = db.db(databaseName);
        onResult(database);
    });
}

module.exports = new UserBroker();