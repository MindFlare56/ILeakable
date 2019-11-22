const Router = require('../models/Router');

class LoginRouter extends Router {

    constructor(app, router) {
        super(app, router);
        console.log("login router");
    }

    initialise() {
        this.setTitle("ILeakable bank");
    }

    initialiseRoutes() {
        this.get('login');
    }
}
