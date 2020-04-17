class Tree {
    static MODE = '100644'  // TODO
    static TYPE = 'tree'

    #entries
    #data
    #id
    
    constructor(entries) {
        this.#entries = entries
        this.#data = this.#entries.map(e => encodeTree(Tree.MODE, e.name, e.id))
        this.#id = require('crypto').createHash('sha1').update(this.getContent()).digest('hex')

    }

    toString() {
        console.log('$$$',this.#id);

        const encoded = this.#entries.map(e => encodeTree(Tree.MODE, e.name, e.id))
        return encoded.toString('utf8')
    }

    getByteLength() {
        return Buffer.concat(this.#data).length
    }

    getContent() {
        const content = `${Tree.TYPE} ${this.getByteLength()}\0${this.toString()}`
        return content
    }

    get id() {
        return this.#id
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
