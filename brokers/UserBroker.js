const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const database = 'ILeak';
const table = 'users';

class UserBroker {

    findByAuth(mail, password, onResult) {
        findSingle({ 'mail': mail, 'password': password }, onResult);
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
}

function findSingle(query, onResult) {
    createConnection(database, (database) => {
        database.collection(table).find({}, {query}).toArray(function (error, result) {
            if (error) throw error;
            onResult(result);
            database.close;
        });
    }, onResult);
}

function insertOne(object, onResult) {
    createConnection(database, (database) => {
        database.collection(table).insertOne(object, function(err, result) {
            if (err) throw err;
            onResult(result['ops'][0]);
            database.close();
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