Field = require('../utilities/Field');

module.exports = class Form {

    #body;
    #fields;

    constructor(body) {
        this.#body = body;
    }

    build() {
        //todo add things to fields
        console.log(this.#body);
        this.#fields = this.#body;
        return this;
    }

    getFields() {
        return this.#fields;
    }

    getField(name) {
        return this.#fields[name];
    }

    addField(parameter) {
        this.#fields.push(new Field(parameter));
    }

    removeField(parameter) {
        const index = this.#fields.indexOf(parameter);
        if (index !== -1) {
            this.#fields.splice(index, 1);
        }
    }

    removeFields() {
        this.#fields = [];
    }
};
