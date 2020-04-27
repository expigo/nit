const Blob = require('./Blob')

class Tree {
    static TYPE = 'tree'

    #entries
    #data
    #id
    
    constructor() {
        this.#entries = {}
        this.#data = []

        // this.#data = this.#entries.map(e => encodeTree(e.mode, e.name, e.id))
        // this.#data = this.#entries.foreach(this.addEntry)
        // this.#id = require('crypto').createHash('sha1').update(this.getContent()).digest('hex')

    }

    toString() {
        // const encoded = this.#entries.map(e => encodeTree(e.mode, e.name, e.id))
        return this.data.toString('utf8')
    }

    getByteLength() {
        console.log(this.data);
        return Buffer.concat(this.data).length
    }

    getContent() {
        console.log('getConnet', this);
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
            // const splittedRelativePath = e.relativePath.split(require('path').sep)
            // const name = splittedRelativePath.pop()
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
                console.log('Going deeper...', this.#entries[e].entries);
                this.#entries[e].traverse(cb)
                for (const e in this.#entries) {
                    if (this.#entries.hasOwnProperty(e)) {
                        const entry = this.#entries[e];
                        this.#data.push(encodeTree(entry.mode, entry.name, entry.id))
                    }
                }
                cb(this.#entries[e])
            }
        }
    }
    get entries() {
        return this.#entries
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

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
