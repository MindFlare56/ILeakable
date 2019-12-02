const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userBroker = require('../brokers/UserBroker');

let _res;
let _form;

router.get('/', function(req, res) {
    res.render('login.pug');
});

router.get('/', function(req, res) {
    res.render('login.pug');
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
    userBroker.findByAuth(_form.mail, crypt(_form.password), (result) => {
        if (decrypt(_form.password, result['password'])) {
            _res.redirect('/main');
        }
        _res.send('doesnt match ' + _form.password + " / " + crypt(_form.password));
    });
}

function register() {
    const mail = _form.mail;
    const firstName = _form.firstName;
    const lastName = _form.lastName;
    const password = _form.password;
    const passwordConfirm = _form.passwordConfirm;
    const hash = verifyPassword(password, passwordConfirm);
    verifyMail(mail);
    onValidRegistration(mail, firstName, lastName, hash);
}

function onValidRegistration(mail, firstName, lastName, hash) {
    userBroker.insertUser(mail, firstName, lastName, hash, () => {
        _res.redirect('/');
        //todo check how to redirect with the result
    });
}

function verifyMail(mail) {

}

function verifyName(firstName, lastName) {

}

function verifyPassword(password, passwordConfirm) {
    return password === passwordConfirm ? crypt(password) : _res.redirect('/error');
}

function crypt(password, saltRound = 11) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRound));
}

function decrypt(password, hash) {
    bcrypt.compareSync(password, hash);
}

module.exports = router;
