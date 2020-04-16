class Tree {
    static ENTRY_FORMAT = ''
    static MODE = '100644'  // TODO
    static TYPE = 'tree'

    #entries
    
    constructor(entries) {
        this.#entries = entries
    }

    toString() {
        entries.sort(e => e.name)
    }


}

module.exports = Tree