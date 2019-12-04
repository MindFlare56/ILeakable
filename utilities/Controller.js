const _express = require('express');
const _router = _express.Router();

module.exports = class Controller {

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

    get(context, path, callback) {
        //todo fix with context
        this.router.get(path, (req, res) => {
            #req = req;
            #res = res;
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