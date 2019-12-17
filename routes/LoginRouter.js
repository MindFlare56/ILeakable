const userBroker = require('../brokers/UserBroker');
const crypto = require('crypto');
const date = require('dateformat');
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
    isMailValid(mail);
    isPasswordValid(password);
    userBroker.findByAuth(mail, (user) => {
        router.verifyPassword(password, user['password']).then(
            () => {
                onLoginIsValid(user);
            }, () => {
                router.addError('Invalid login information');
            }
        );
    });
}

function validateRegisterInformation(mail, firstName, lastName, password, passwordConfirm) {
    isMailValid(mail);
    passwordMatch(password, passwordConfirm);
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
    return router.redirectHome();
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
    //
}

function isPasswordValid(password) {
    //
}

function verifyName(firstName, lastName) {
    //
}

function passwordMatch(password, passwordConfirm) {
    return password === passwordConfirm;
}

module.exports = router.routes();
