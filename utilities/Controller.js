const _express = require('express');
const _router = _express.Router();

module.exports = class Router {

    router;
    express;
    #req;
    #res;

    constructor() {
        this.router = _router;
        this.express = _express;
    }

    defineRoutes() {

    }

    routes() {
        this.defineRoutes();
        return this.router;
    }

    get(path, callback) {
        const ref = this;
        this.router.get(path, function(req, res) {
            ref.#req = req;
            ref.#res = res;
            callback();
        })
    }

    redirect(url) {
        this.before();
        this.#res.redirect(url);
        this.after();
    }

    render(file, parameters = '') {
        this.before();
        this.#res.render(file, parameters);
        this.after();
    }

    before() {

    }

    after() {

    }
};