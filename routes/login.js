const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userBroker = require('../brokers/UserBroker');

let _res;
let _form;

router.get('/', function(req, res) {
    userBroker.findUsers((users) => {
        res.send(users);
        userBroker.transferMoney(users[0], users[1], 10, () => {

        });
    });
    //res.render('login.pug');
});

router.post('/', function(req, res) {
    res.render('login.pug', { 'user': req.body.user });
});

router.post('/submit-login', function(req, res) {
    initPost(req, res);
    authenticate();
});

router.post('/submit-register', function(req, res) {
    initPost(req, res);
    register();
});

function initPost(req, res) {
    _res = res;
    _form = req.body;
}

function authenticate() {
    validateLoginInformation(_form.mail);
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



function register() {
    const mail = _form.mail;
    const firstName = _form.firstName;
    const lastName = _form.lastName;
    const password = _form.password;
    const passwordConfirm = _form.passwordConfirm;
    validateRegisterInformation(mail, firstName, lastName, password, passwordConfirm);
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

module.exports = router;
