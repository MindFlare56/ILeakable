module.exports = class UserBroker {

    static #color = 'color: #';
    static #background = 'background: #';

    static showForBrowser(message, color = 'bada55', background = '222') {
        if (color !== '') color = this.#color + color;
        if (background !== '') color = this.#background + background;
        console.log('%c ' + message, background + '; ' + color + '; ')
    }

    //todo debug is json and send the good one
    static spacedLog(message) {
        console.log(
            '\n\n-----------------------------------------------------------------------------------------------------------\n\n'
            + message +
            '\n\n-----------------------------------------------------------------------------------------------------------\n\n'
        )
    }

    static spacedLogJson(message) {
        console.log(
            '\n\n-----------------------------------------------------------------------------------------------------------\n\n'
            + JSON.stringify(message) +
            '\n\n-----------------------------------------------------------------------------------------------------------\n\n'
        )
    }
};


