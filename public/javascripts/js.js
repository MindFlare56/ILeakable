;'use strict';

$(function(){
    let loginButton = $(".card-login-button");
    let registerButton = $(".card-register-button");
    let registerForm = $("#registerForm");
    let loginForm = $("#loginForm");
    loginButton.click(function () {
        registerButton.css("background-color","transparent");
        loginButton.css("background-color","#182E38");
        loginForm.css("display", "block");
        registerForm.css("display", "none");
    });
    registerButton.click(function () {
        loginButton.css("background-color","transparent");
        registerButton.css("background-color","#182E38");
        registerForm.css("display", "block");
        loginForm.css("display", "none");
    });
});
