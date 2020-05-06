const fs = require('fs')
const path = require('path')

const Lockfile = require('./Lockfile')
const { LockDenied } = require('../utils/errors/LockErrors')

class Refs {
    #pathname
    #headPath

    constructor(pathname) {
        this.#pathname = pathname
        this.#headPath = path.join(this.#pathname, 'HEAD')
    }

    async updateHead(id) {
        var lockfile = new Lockfile(this.#headPath)

        
        if(!(await lockfile.holdForUpdate())) {
            throw new LockDenied(`Could not aquire lock on file: ${this.#headPath}`)
        }
        try {
            await lockfile.write(id)
            await lockfile.write('\n')
            await lockfile.commit()
        } catch (err) {
            console.error(err);
        }
    }

    readHead() {
       if (fs.existsSync(this.#headPath)) {
           var head = fs.readFileSync(this.#headPath, 'utf8')
       }
       return head
    }
}

module.exports = Refs