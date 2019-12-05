const bcrypt = require('bcryptjs');
const userBroker = require('../brokers/UserBroker');

const Controller = require('../utilities/Controller');

const mainRouter = new class MainRouter extends Controller {

    #router;

    constructor() {
        super();
    }

    defineRoutes() {
        this.get('/', this.renderLogin);
        this.post('/', this.renderPostLogin);
        this.post('/submit-login', this.authenticate);
        this.post('/submit-register', this.register);
    }

    renderLogin(router) {
        router.render('login.pug');
    }

    renderPostLogin(router) {
        router.render('login.pug', { 'user': req.body.user });
    }

    authenticate(router) {
        this.#router = router;
        const fields = this.buildForm().getFields();
        validateLoginInformation(fields.mail, fields.password);
    }

    register(router) {
        this.#router = router;
        const fields = this.buildForm().getFields();
        validateRegisterInformation(
            fields.mail, fields.firstName, fields.lastName, fields.password, fields.passwordConfirm
        );
    }
};

function validateLoginInformation(mail, password) {
    verifyMail(mail);
    userBroker.findByAuth(mail, (user) => {
        decrypt(password, user['password'], (valid) => {
            valid ? _res.redirect('/main') : _res.redirect('/error');
        })
    });
}

function validateRegisterInformation(mail, firstName, lastName, password, passwordConfirm) {
    verifyMail(mail);
    verifyPassword(password, passwordConfirm);
    crypt(password, (hash) => {
        onValidRegistration(mail, firstName, lastName, hash);
    })
}

function onValidRegistration(mail, firstName, lastName, hash) {
    userBroker.insertUser(mail, firstName, lastName, hash, () => {
        return _res.redirect('/');
    });
}

function verifyMail(mail) {
    //
}

function verifyName(firstName, lastName) {

}

function verifyPassword(password, passwordConfirm) {
    return password === passwordConfirm;
}

function crypt(password, callback, saltRound = 11) {
    bcrypt.genSalt(saltRound, function(saltError, salt) {
        bcrypt.hash(password, salt, function(error, hash) {
            callback(hash);
        });
    });
}

function decrypt(password, hash, callback) {
    password = getDefaultPasswordField(password);
    bcrypt.compare(password, hash, function(error, result) {
        callback(result);
    });
}

module.exports = mainRouter.routes();
