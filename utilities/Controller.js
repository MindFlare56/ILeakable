const _express = require('express');
const _router = _express.Router();
const Form = require('../utilities/Form');

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

    //todo pass form to get/post/put/delete...
    get(path, callback) {
        this.router.get(path, (req, res) => {
            this.#req = req;
            this.#res = res;
            callback(this)
        });
    }

    post(path, callback) {
        this.router.post(path, (req, res) => {
            this.#req = req;
            this.#res = res;
            callback(this)
        });
    }

    redirect(url) {
        this.before();
        this.#res.redirect(url);
        this.after();
    }

    render(file, parameters = '') {
        this.before();
        tryBuildingParameters(parameters);
        this.#res.render(file, parameters);
        this.after();
    }

    before() {
        
    }

    after() {

    }
};

function tryBuildingParameters(parameters) {
    validateParametersArray(parameters, () => {
        for (const parameter in parameters) {
            if (typeof parameter === 'string') {
                const form = new Form();
                //todo check warning
                form.addField(parameter);
            }
        }
    });

}

function validateParametersArray(parameters, onValid) {
    if (Array.isArray(parameters)) {
        if (parameters.length > 0) {
            onValid();
        }
    }
}
