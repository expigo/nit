class Blob {
    #id
    #data

    constructor(buffer) {
        this.#data = buffer
        this.#id = require('crypto').createHash('sha1').update(this.getContent()).digest('hex')
    }

    get id() {
        return this.#id
    }

    toString() {
        return this.#data.toString('utf8')
    }

    getByteLength() {
        return this.#data.length
    }

    getContent() {
        return `${this.TYPE} ${this.getByteLength()}\0${this.toString()}`
    }

    get id() {
        return this.#id
    }
}

Blob.prototype.TYPE = 'blob'
Blob.of = function(data) {
    return new Blob(Buffer.from(data))
}

module.exports = Blob