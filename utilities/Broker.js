const MongoClient = require('mongodb').MongoClient;

module.exports = class Broker {

    #databaseName;
    #tableName;
    #url;
    #Client;
    #database;
    #result;

    onError = (error) => {
        if (error) {
            throw error;
        }
    };

    onResult = (onResultCallback, result = null) => {
        if (result == null) {
            result = this.#result;
        }
        onResultCallback(result);
    };

    constructor() {
        this.#Client = MongoClient;
        this.useConnectionUrl();
    }

    useDatabase(databaseName) {
        this.#databaseName = databaseName;
    }

    useTable(tableName) {
        this.#tableName = tableName;
    }

    useConnectionUrl(url = 'mongodb://localhost:27017/') {
        this.#url = url;
    }

    //todo test
    update(query, onResultCallback) {
        this.createConnection(this.#databaseName, () => {
            this.#database.collection(this.#tableName).update(query).toArray((error, result) => {
                this.onError(error);
                this.#result = result;
                this.onResult(onResultCallback);
            });
        }, onResultCallback);
    }

    updateWhere(filter, update, onResultCallback) {
        this.createConnection(this.#databaseName, () => {
            this.#database.collection(this.#tableName).updateMany(filter, update, (error, result) => {
                this.onError(error);
                this.#result = result;
                this.onResult(onResultCallback);
            });
        }, onResultCallback);
    }

    findAll(onResultCallback) {
        this.createConnection(this.#databaseName, () => {
            this.#database.collection(this.#tableName).find({}).toArray((error, result) => {
                this.onError(error);
                this.#result = result;
                this.onResult(onResultCallback);
            });
        }, onResultCallback);
    }

    findSingle(query, onResultCallback) {
        this.createConnection(this.#databaseName, () => {
            this.#database.collection(this.#tableName).find({}, {query}).toArray((error, result) => {
                this.onError(error);
                this.#result = result;
                this.onResult(onResultCallback, result[0]);
            });
        }, onResultCallback);
    }

    insertOne(object, onResultCallback) {
        this.createConnection(this.#databaseName, () => {
            this.#database.collection(this.#tableName).insertOne(object, (error, result) => {
                this.onError(error);
                this.#result = result;
                this.onResult(onResultCallback, result['ops'][0]);
            });
        }, onResultCallback);
    }

    createConnection(databaseName, onConnectionEstablished) {
        this.#Client.connect(this.#url, {}, (err, db) => {
            if (err) throw err;
            this.#database = db.db(databaseName);
            onConnectionEstablished();
            this.#database.close;
        });
    }
};
