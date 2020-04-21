class Entry{
    // git distinguishes only two file modes:
    static REGULAR_MODE = '100644'
    static EXECUTABLE_MODE = '100755'

    #name
    #id
    #stat
    constructor(name, id, stat) {
        this.#name = name
        this.#id = id
        this.#stat = stat
    }

    valueOf() {
        return `${this.#name}  ${this.#id}`
    }

    get mode() {
        return this.#stat.mode.toString(8).slice(3).startsWith(7)
         ? Entry.EXECUTABLE_MODE
         : Entry.REGULAR_MODE
    }
    get name() {
        return this.#name   
    }
    

    get id() {
        return this.#id   
    }
    
}

module.exports = Entry