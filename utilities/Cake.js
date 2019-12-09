

const cake = class Cake {

    #session;
    #cookies;

    constructor(session, cookies) {
        this.#session = session;
        this.#cookies = cookies;
    }

    getSession() {
        return this.#session;
    }
};



module.exports = cake;
