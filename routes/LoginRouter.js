const bcrypt = require('bcryptjs');
const userBroker = require('../brokers/UserBroker');

const Controller = require('../utilities/Controller');

const mainRouter = new class MainRouter extends Controller {

    constructor() {
        super();
    }

    defineRoutes() {
        this.get('/', this.renderLogin);
        this.post('/', this.renderUserLogin);
        this.post('/submit-login', this.authenticate);
        this.post('/submit-register', this.register);
    }

    renderLogin(router) {
        router.render('login.pug');
    }

    renderUserLogin(router) {
        //todo replace all this with a form method that will only use the field name and do the rest
        router.render('login.pug', { 'user': req.body.user });
    }

    authenticate(form) {
        form.build();
        validateLoginInformation(form.getFields['mail']);
    }

    register(form) {

    }
};

function authenticate() {
    initPost(req, res);
    this.#validateLoginInformation(_form.mail);
}

function register() {
    const mail = _form.mail;
    const firstName = _form.firstName;
    const lastName = _form.lastName;
    const password = _form.password;
    const passwordConfirm = _form.passwordConfirm;
    validateRegisterInformation(mail, firstName, lastName, password, passwordConfirm);
}

function validateLoginInformation(mail) {
    verifyMail(mail);
    userBroker.findByAuth(mail, (user) => {
        _res.send(user);
        decrypt(user['password'], (valid) => {
            if (valid) {
                return _res.redirect('/main');
            }
            return _res.redirect('/error');
        })
    });
}

function validateRegisterInformation(mail, firstName, lastName, password, passwordConfirm) {
    verifyMail(mail);
    verifyPassword(password, passwordConfirm);
    crypt((hash) => {
        onValidRegistration(mail, firstName, lastName, hash);
    })
}

function onValidRegistration(mail, firstName, lastName, hash) {
    userBroker.insertUser(mail, firstName, lastName, hash, () => {
        return _res.redirect('/');
    });
}

function verifyMail(mail) {

}

function verifyName(firstName, lastName) {

}

function verifyPassword(password, passwordConfirm) {
    return password === passwordConfirm;
}

function crypt(callback, password = '', saltRound = 11) {
    password = getDefaultPasswordField(password);
    bcrypt.genSalt(saltRound, function(saltError, salt) {
        bcrypt.hash(password, salt, function(error, hash) {
            callback(hash);
        });
    });
}

function decrypt(hash, callback, password = '') {
    password = getDefaultPasswordField(password);
    bcrypt.compare(password, hash, function(error, result) {
        callback(result);
    });
}


function getDefaultPasswordField(password) {
    if (password === '') {
        password = _form.password;
    }
    return password;
}

module.exports = mainRouter.routes();
