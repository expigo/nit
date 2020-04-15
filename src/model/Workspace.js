const fs = require('fs')

class Workspace {
    #pathname

    constructor(path) {
        this.#pathname = path
    }

    listFiles() {
        return fs.readdirSync(this.#pathname, { withFileTypes: true}).filter(obj => !Workspace.IGNORE.includes(obj.name))
    }

}

Workspace.IGNORE = ['.', '..', '.nit']

module.exports = Workspace