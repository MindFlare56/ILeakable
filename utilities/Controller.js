const _express = require('express');
const _router = _express.Router();
const Form = require('../utilities/Form');

module.exports = class Controller {

    #request;
    #response;
    #route = '';

    #beforeAction = (path, request, response, callback) => {
        this.before();
        logRequestInformation(path, request);
        this.#request = request;
        this.#response = response;
        callback(this);
    };

    useRoute(defaultRoute) {
        this.#route = defaultRoute;
    }

    defineRoutes() {

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

    send(data) {
        this.#response.send(data);
    }

    render(file, parameters = '') {
        this.#response.render(file, parameters);
    }

    before() {
        //todo validate session
    }

    after() {

    }
};

function logRequestInformation(path, req) {
    console.log('\n');
    console.log('Get from: ' + path);
    console.log('Origin: ' + req.get('origin'));
    console.log('Host: ' + req.get('host'));
    console.log('Req user ip: ' + req.socket.remoteAddress);
    console.log('\n');
}
