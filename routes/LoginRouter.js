const userBroker = require('../brokers/UserBroker');
const crypto = require('crypto');
const date = require('dateformat');
const rule = require('../utilities/Rule');
const Controller = require('../utilities/Controller');

const router = new class LoginRouter extends Controller {

    //todo add parameter so start with register open instead of login

    settings() {
        this.useRenderRoute('/login');
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
        router.render('login.pug', {
            'user': this.buildForm().getField('user')
        });
    }

    authenticate(router) {
        const fields = router.buildForm().getFields();
        validateLoginInformation(fields);
    }

    register(router) {
        const fields = router.buildForm().getFields();
        validateRegisterInformation(
            fields.mail, fields.firstName, fields.lastName, fields.password, fields.passwordConfirm
        );
    }
};

function validateLoginInformation(fields) {
    const mail = fields.mail;
    const password = fields.password;
    validateLoginFields(mail, password);
    if (router.hasError()) { return router.redirectLogin() }
    userBroker.findByAuth(mail, (user) => {
        if (user == null) {
            router.addError('User doesn\'t exist');
            return router.redirectLogin()
        }
        router.verifyPassword(password, user['password']).then(
            () => {
                onLoginIsValid(user);
            }, () => {
                router.addError('Invalid login information');
            }
        );
    });
}

function validateLoginFields(mail, password) {
    isMailValid(mail);
    isPasswordValid(password);
}

function validateRegisterFields(mail, firstName, lastName, password, passwordConfirm) {
    isMailValid(mail);
    isPasswordValid(password);
    verifyName(firstName, lastName);
    passwordMatch(password, passwordConfirm);
}

function validateRegisterInformation(mail, firstName, lastName, password, passwordConfirm) {
    validateRegisterFields(mail, firstName, lastName, password, passwordConfirm);
    if (router.hasError()) { return router.redirectLogin() }
    router.hashPassword(password).then(
        (hash) => {
            onValidRegistration(mail, firstName, lastName, hash);
        }, () => {
            router.addError('Couldn\'t not hash your password');
        }
    );
}

function onLoginIsValid(user) {
    router.logon(user);
    router.redirectHome();
}

function onValidRegistration(mail, firstName, lastName, hash) {
    const accounts = [{
        name: "Credit",
        number: crypto.randomBytes(8).toString('base64'),
        money: 0,
        expiration: date(new Date(), 'yyyy/mm/dd'),
        secureCode: crypto.randomBytes(4).toString('base64')
    }];
    userBroker.insertUser(mail, firstName, lastName, hash, accounts, () => {
        router.addInfo('User \"' + mail + '\" has been created');
        return router.redirectLogin();
    });
}

function isMailValid(mail) {
    if (!rule.mail(mail)) {
        console.log("mail");
        router.addError('Invalid mail format');
    }
}

function isPasswordValid(password) {
    if (!rule.password(password)) {
        console.log("password");
        router.addError('Invalid password format');
    }
}

function verifyName(firstName, lastName) {
    if (!rule.name(firstName)) {
        console.log("firstname");
        router.addError('First name is not valid');
    }
    if (!rule.name(lastName)) {
        console.log("lastname");
        router.addError('Last name is not valid');
    }
}

function passwordMatch(password, passwordConfirm) {
    if (!rule.sameAs(password, passwordConfirm)) {
        console.log("match");
        router.addError('Passwords does not match');
    }
}

module.exports = router.routes();
