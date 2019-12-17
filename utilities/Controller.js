const _express = require('express');
const _router = _express.Router();
const _debug = require('./Debug');
const bcrypt = require('bcryptjs');
const Form = require('../utilities/Form');

//todo refactor logic somewhere else
module.exports = class Controller {

    #request;
    #response;
    #renderRoute = '';
    #defaultParameters = {};
    #file;
    #loginRoute = '/login';
    #registerRoute = '/register';
    #homeRoute = '/home';
    #hasLoggedOnce = false;
    #hasError = false;

    //todo find a way to do this without doing it everywhere or hard coding it
    constructor(homeRoute = '/main', loginRoute = '/login', registerRoute = '/login') {
        if (homeRoute !== '') this.#homeRoute = homeRoute;
        if (loginRoute !== '') this.#loginRoute = loginRoute;
        if (registerRoute !== '') this.#registerRoute = registerRoute;
        this.settings();
    }

    validateSession() {
        if (this.#hasLoggedOnce) {
            if (this.#request.session.user && this.#request.cookies.user_sid) {
                return;
            }
            return this.redirectLogin();
        }
    };

    useRenderRoute(route) {
        this.#renderRoute = route;
    }

    settings() {}

    defineRoutes() {}

    useParameters(parameters) {
        this.debugJson(parameters);
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

        path = this.#renderRoute + path;
        _router.get(path, (req, res) => {
            this.#defaultParameters['_csrf'] = req.cookies['_csrf'];
            this.#beforeAction(path, req, res, callback);
            this.after();
        });
    }

    post(path, callback) {
        path = this.#renderRoute + path;
        _router.post(path, (request, response) => {
            this.#beforeAction(path, request, response, callback);
            this.after();
        });
    }

    redirect(url) {
        this.#hasError = false;
        //todo clear alerts
        if (!this.#response.headersSent) {
            this.#response.redirect(url);
        }
    }

    redirectBackward() {
        const originalUrl = this.#request.originalUrl;
        let i = originalUrl.lastIndexOf('/');
        i = i === -1 ? originalUrl.length : i + 1;
        const previousUrl = originalUrl.substring(0, i);
        this.#response.redirect(previousUrl);
    }

    redirectHome() {
        this.redirect(this.#homeRoute)
    }

    redirectLogin() {
        this.disconnect();
        this.redirect(this.#loginRoute);
    }

    redirectRegister() {
        this.redirect(this.#registerRoute)
    }

    send(data) {
        this.#response.send(data);
    }

    render(file, parameters = {}) {
        _debug.spacedLog("?");
        this.#file = file;
        parameters = addDefaultParameters(parameters, this.#defaultParameters);
        this.debugJson(parameters);
        this.#response.render(file, parameters);
    }

    //todo refactor in an error module
    errorMessage(message = 'Something went wrong :/', title = 'Error', width = '') {
        return { 'type': 'danger', 'content': message, 'title': title, 'width':  width}
    }

    addError(message = 'Something went wrong :/', title = 'Error') {
        this.#hasError = true;
        if (this.#defaultParameters['messages'] === undefined) {
            this.#defaultParameters['messages'] = [this.errorMessage(message, title)];
        } else {
            this.#defaultParameters['messages'].push(this.errorMessage(message, title));
        }
    }

    hasError() {
        return this.#hasError;
    }

    //todo refactor in an error module
    informationMessage(message, title = 'Info', width = '') {
        return { 'type': 'info', 'content': message, 'title': title, 'width':  width}
    }

    addInfo(message, title = 'Info') {
        if (this.#defaultParameters['messages'] === undefined) {
            this.#defaultParameters['messages'] = [this.informationMessage(message, title)];
        } else {
            this.#defaultParameters['messages'].push(this.informationMessage(message, title));
        }
    }

    before() {
        this.validateSession();
    }

    debug(message) {
        _debug.spacedLog(message);
    }

    debugJson(message) {
        _debug.spacedLogJson(message);
    }

    async hashPassword(password, saltRounds = 11) {
        return await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(error, hash) {
                if (error) {
                    reject(error);
                } else {
                    resolve(hash);
                }
            });
        });
    }

    async verifyPassword(password, hash) {
        return await new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function(error, result) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    logon(user) {
        this.#request.session.user = user;
        this.#hasLoggedOnce = true;
    }

    disconnect() {
        if (this.#request.session.user && this.#request.cookies.user_sid) {
            this.#response.clearCookie('user_sid');
        }
        this.#hasLoggedOnce = false;
    }

    clear() {

    }

    //todo check why session.user keep resetting
    getUser() {
        const session = this.#request.session;
        if (typeof session !== 'undefined') {
            if (typeof session.user !== 'undefined') {
                return this.#request.session.user
            }
        }
        this.redirectLogin();
    }

    after() {}

    #beforeAction = (path, request, response, callback) => {
        this.before();
        logRequestInformation(path, request);
        this.#request = request;
        this.#response = response;
        callback(this);
    };
};

function addDefaultParameters(parameters, defaultParameters) {
    for (const parameter in defaultParameters) {
        parameters[parameter] = defaultParameters[parameter];
    }
    return parameters;
}

function logRequestInformation(path, req) {
    console.log('_____________________________________________\n');
    console.log('Get from: ' + path);
    console.log('Origin: ' + req.get('origin'));
    console.log('Host: ' + req.get('host'));
    console.log('Req user ip: ' + req.socket.remoteAddress);
    console.log('Time: ' + Date.now());
    console.log('_____________________________________________\n');
}
