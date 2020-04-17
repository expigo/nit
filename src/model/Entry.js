class Entry{
    #name
    #id
    constructor(name, id) {
        this.#name = name
        this.#id = id
    }

    valueOf() {
        return `${this.#name}  ${this.#id}`
    }

    get name() {
        return this.#name   
    }
    

    get id() {
        return this.#id   
    }
    
}

module.exports = Entry