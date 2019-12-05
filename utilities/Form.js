Field = require('../utilities/Field');

module.exports = class Form {

    #body;
    #fields;

    constructor(body) {
        #body = body;
    }

    build() {

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
        #fields = [];
    }
};
