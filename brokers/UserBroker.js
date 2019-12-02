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

    transferMoney(userFrom, userTo, amount, onResult) {
        createConnection(database, (database) => {
            //todo fix this query
            const query = [
                {'_id': userFrom['_id'], $set: {Account: {money: Account['money'] - amount}}},
                {}
            ];
            database.collection(table).updateMany(query, amount, function (error, result) {
                if (err) throw err;
                //result.result.nModified  (doc modified)
                onResult(result);
                db.close;
            });
        })
    }
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