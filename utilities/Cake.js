

const cake = class Cake {

    #session;
    #cookies;

    constructor(session, cookies) {
        this.#session = session;
        this.#cookies = cookies;
    }

    make(data, lifetime, cookieName) {
        //create sid

    }

    getSession() {
        return this.#session;
    }
};

function bake(sid, lifetime, cookieName) {
    //create coockie with name
    //destroy previous
    //set lifetime
    //set value
    //send
}

module.exports = cake;
