const fs = require('fs')
const path = require('path')

class Workspace {
    #pathname

    constructor(path) {
        this.#pathname = path
    }

    listFiles() {
        return fs.readdirSync(this.#pathname, { withFileTypes: true}).filter(obj => !Workspace.IGNORE.includes(obj.name))
    }

    readFile(absolutePathToFile) {
        return fs.readFileSync(path.join(this.#pathname, absolutePathToFile))
    }

    statFile(filename) {
        return fs.statSync(path.join(this.#pathname, filename))
    }

}

Workspace.IGNORE = ['.', '..', '.nit']

module.exports = Workspace