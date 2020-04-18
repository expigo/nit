class Commit {
    #id
    #tree
    #author
    #message

    constructor(tree, author, message) {
        this.#tree = tree
        this.#author = author
        this.#message = message
        this.#id = require('crypto').createHash('sha1').update(this.getContent()).digest('hex')
    }


    getContent() {
        return `${this.TYPE} ${this.getByteLength()}\0${this.toString()}`
    }

    toString() {
        return `tree ${this.#tree}
author ${this.#author}
committer ${this.#author}
                
${this.#message}`
    }


    getByteLength() {
        return this.toString().length
    }

    get id() {
        return this.#id
    }
}

Commit.prototype.TYPE = 'commit'
module.exports = Commit