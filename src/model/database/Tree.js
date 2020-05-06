const { hexToBytes } = require('../../utils/index')

class Tree {
    static TYPE = 'tree'

    #entries
    #data
    #id
    
    constructor() {
        this.#entries = {}
        this.#data = []
    }

    toString() {
        return this.#data
    }

    getByteLength() {
        return Buffer.concat(this.data).length
    }

    getContent() {
        const content = `${Tree.TYPE} ${this.getByteLength()}\0${this.toString()}`
        return content
    }

    get id() {
        return this.#id
    }

    static build(entries) {
        entries.sort(function compareRelativePaths(e1, e2) {
            return e1.relativePath >= e2.relativePath ? 1 : -1
        })
        const tree = new Tree()

        entries.forEach(e => {
            tree.addEntry(e.parentDirectories(), e)
        })

        return tree
    }

    addEntry(parents, entry) {
        if(parents.length == 0 || parents == undefined) {
            this.#entries[entry.name] = entry
        } else {
            const prop = parents.shift()
            this.#entries[prop] = this.#entries[prop] || new Tree()
            this.#entries[prop].addEntry(parents, entry)
        }
    }

    traverse(cb) {
        for (const e in this.#entries) {
            if (this.#entries[e] instanceof Tree) {
                this.#entries[e].traverse(cb)
            }
        }
        this.encodeData()
        this.setId()
        cb(this)
    }

    encodeData() {
        this.data = Object.entries(this.#entries).map(([name,e]) =>  {
            return encodeTree(e.mode, name, e.id)
        })
    }

    setId() {
        this.#id = require('crypto').createHash('sha1').update(this.getContent()).digest('hex')
    }

    set data(data) {
        this.#data = data
    }

    get data() {
        return this.#data
    }

    get entries() {
        return this.#entries
    }
    
    get mode() {
        return require('../Entry').DIRECTORY_MODE
    }
}



module.exports = Tree


// ***************

function encodeTree(mode, name, id) {
    var encoder = new TextEncoder()
    var encodedMode = encoder.encode(mode.padEnd(mode.length + 1, ' '))
    var encodedName = encoder.encode(name.padEnd(name.length + 1, '\0'))
    var encodedId = Uint8Array.from(hexToBytes(id))
    var bufLength = encodedMode.length + encodedName.length + encodedId.length;

    return Buffer.concat([encodedMode, encodedName, encodedId], bufLength)

}
