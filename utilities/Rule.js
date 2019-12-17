

module.exports = new class Rule {

    #mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    #usernameFormat = /\/^[A-Za-z][A-Za-z0-9]{5,31}$\//;
    #passwordFormat = /^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
    #nameFormat = /^[A-Z]{1}[a-zA-Z]{1,79}$/;
    #isDecimal = /^[0-9]+((\.|,)[0-9]+)?$/;
    #isInteger = /^[0-9]+$/;
    #isSignedDecimal = /^-?[0-9]+((\.|,)[0-9]+)?$/;
    #isSignedInteger = /^-?[0-9]+$/;


    mail(mail) {
        return mail.match(this.#mailFormat);
    }

    username(username) {
        return username.match(this.#usernameFormat);
    }

    password(password) {
        return password.match(this.#passwordFormat);
    }

    decimal(number) {
        number.match(this.#isDecimal);
    }

    integer(number) {
        number.match(this.#isInteger);
    }

    name(name) {
        return name.match(this.#nameFormat);
    }

    isSignedDecimal(decimal) {
        return decimal.match(this.#isSignedDecimal);
    }

    isSignedInteger(number) {
        number.match(this.#isSignedInteger);
    }

    isBoolean(value) {
        return typeof value === "boolean";
    }

    isInRange(data, min, max) {
        return (min <= data) && (data <= max);
    }

    sameAs(value1, value2) {
        return value1 === value2;
    }
};