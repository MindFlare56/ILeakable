const bcrypt = require('bcryptjs');
const userBroker = require('../brokers/UserBroker');
const Controller = require('../utilities/Controller');

const loginRouter = new class LoginRouter extends Controller {

    defineRoutes() {
        this.useRoute('/login');
        this.get('/', this.renderLogin);
        this.post('/', this.renderPostLogin);
        this.post('/submit-login', this.authenticate);
        this.post('/submit-register', this.register);
    }

    renderLogin(router) {
        router.render('login.pug');
    }

    renderPostLogin(router) {
        router.render('login.pug', {
            'user': this.buildForm().getField('use')
        });
    }

    authenticate(router) {
        const fields = router.buildForm().getFields();
        validateLoginInformation(fields.mail, fields.password);
    }

    register(router) {
        const fields = router.buildForm().getFields();
        validateRegisterInformation(
            fields.mail, fields.firstName, fields.lastName, fields.password, fields.passwordConfirm
        );
    }
};

function validateLoginInformation(mail, password) {
    verifyMail(mail);
    userBroker.findByAuth(mail, (user) => {
        decrypt(password, user['password'], (valid) => {
            valid ? onLoginIsValid(loginRouter, user) : loginRouter.redirect('/error');
        });
    });
}

function onLoginIsValid(router, user) {
    router.initialiseCake(user, 1000000);
    router.redirect('/main');
}

function validateRegisterInformation(mail, firstName, lastName, password, passwordConfirm) {
    verifyMail(mail);
    verifyPassword(password, passwordConfirm);
    crypt(password, (hash) => {
        onValidRegistration(mail, firstName, lastName, hash);
    });
}

function onValidRegistration(mail, firstName, lastName, hash) {
    userBroker.insertUser(mail, firstName, lastName, hash, () => {
        return loginRouter.redirect('/');
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
    bcrypt.genSalt(saltRound, (saltError, salt) => {
        bcrypt.hash(password, salt, (error, hash) => {
            callback(hash);
        });
    });
}

function decrypt(password, hash, callback) {
    bcrypt.compare(password, hash, (error, result) => {
        callback(result);
    });
}

module.exports = loginRouter.routes();
