const _express = require('express');
const _router = _express.Router();
const ObviousLog = require('./ObviousLog');
const Cake = require('./Cake');
const Form = require('../utilities/Form');

module.exports = class Controller {

    #request;
    #response;
    #route = '';
    #defaultParameters;

    constructor() {
        this.settings();
    }


    #beforeAction = (path, request, response, callback) => {
        this.before(request, response);
        logRequestInformation(path, request);
        this.#request = request;
        this.#response = response;
        callback(this);
    };

    useRoute(defaultRoute) {
        this.#route = defaultRoute;
    }

    settings() {}

    defineRoutes() {}

    useParameters(parameters) {
        this.#defaultParameters = parameters;
    }

    routes() {
        this.defineRoutes();
        return _router;
    }

    buildForm() {
        return new Form(this.#request.body).build();
    }

    //todo /put/delete...
    get(path, callback) {
        path = this.#route + path;
        _router.get(path, (req, res) => {
            this.#beforeAction(path, req, res, callback);
            this.after();
        });
    }

    post(path, callback) {
        path = this.#route + path;
        _router.post(path, (request, response) => {
            this.#beforeAction(path, request, response, callback);
            this.after();
        });
    }

    redirect(url) {
        this.#response.redirect(url);
    }

    redirectBackward() {
        const originalUrl = this.#request.originalUrl;
        let i = originalUrl.lastIndexOf('/');
        i = i === -1 ? originalUrl.length : i + 1;
        const previousUrl = originalUrl.substring(0, i);
        this.#response.redirect(previousUrl);
    }

    redirectDefault() {
        //todo test
        this.#response.redirect(this.#route)
    }

    send(data) {
        this.#response.send(data);
    }

    render(file, parameters = '') {
        parameters = addDefaultParameters(parameters, this.#defaultParameters);
        this.#response.render(file, parameters);
    }

    before(request, response) {
        //todo validate session
    }

    initialiseCake(data, lifetime = '', cookieName = '') {
        let cake = new Cake(this.#request, this.#response);
        cake.make(data, lifetime, cookieName);
        this.#response.send(cake);
        throw "stop execution";
    }

    after() {}
};

function addDefaultParameters(parameters, defaultParameters) {
    for (const parameter in defaultParameters) {
        parameters[parameter] = defaultParameters[parameter];
    }
    return parameters;
}

function logRequestInformation(path, req) {
    console.log('\n');
    console.log('Get from: ' + path);
    console.log('Origin: ' + req.get('origin'));
    console.log('Host: ' + req.get('host'));
    console.log('Req user ip: ' + req.socket.remoteAddress);
    console.log('\n');
}
