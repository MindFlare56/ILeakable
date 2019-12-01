const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');

router.get('/', function(req, res) {
    res.render('login.pug');
});

router.post('/submit-login', function(req, res) {
    res.redirect('/main');
});

router.post('/submit-register', function(req, res) {
    const form = req.body;
    authenticate(form, res);
});

function authenticate(form, res) {
    let message = "";
    const mail = form.mail;
    const firstName = form.firstName;
    const lastName = form.lastName;
    const password = form.password;
    const passwordConfirm = form.passwordConfirm;
    verifyPassword(password, passwordConfirm);
    verifyMail(mail, res);
}

function verifyMail(mail) {

}

function verifyPassword(password, passwordConfirm) {
    if (password === passwordConfirm) {
        const hashedPassword = passwordHash.generate(password);
        return hashedPassword + " \n";
    } else {
        return "password doesnt match \n";
    }
}

module.exports = router;
