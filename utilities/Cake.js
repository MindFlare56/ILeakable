

const cake = class Cake {

    #request;
    #response;
    #cookies;
    #session;

    constructor(request, response) {
        this.#request = request;
        this.#response = response;
        this.#session = request.session;
        this.#cookies = request.cookies;
    }

    make(data, lifetime = null, cookieName = '') {
        const sid = this.#request.sessionID;
        if (cookieName === null) {
            cookieName = sid;
        }
        if (lifetime === -1) {
            lifetime = 3600000; //hour
        }
        this.bake(sid, lifetime, cookieName)
    }

    bake(sid, lifetime, cookieName) {
        this.#response.cookie(cookieName, sid);
        this.#response.send(this.#session);
        this.#session.cookie.maxAge(lifetime);
    }

    getSession() {
        return this.#session;
    }
};

module.exports = cake;
