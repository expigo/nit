class Author {
    #name
    #email
    #time

    constructor(name, email) {
        this.#name = name
        this.#email = email
        this.#time = Date.now()
    }

    toString() {
        var timestamp  = `${this.#time} ${new Date().toTimeString().substring(12, 17)}`
        return `${this.#name} <${this.#email}> ${timestamp}`
    }
}

module.exports = Author