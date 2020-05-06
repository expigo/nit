const fs = require('fs')
const fsPro = fs.promises
const path = require("path")

const { MissingParent, NoPermission, StaleLock} = require('../utils/errors/LockErrors')

class Lockfile {
    #filePath
    #lockPath
    #lock = null
    
    constructor(filePath) {
        this.#filePath = filePath
        this.#lockPath = this.#filePath + '.lock'
    }
    
    async holdForUpdate() {
        try {
            if(!this.#lock) {
                const flags = fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL
                this.#lock = await fsPro.open(this.#lockPath, flags)
                return true
            }
        } catch (err) {
            console.error(err);
            if (err.code == 'EEXIST') {
                return false
            } else if (err.code == 'ENOENT') {
                throw new MissingParent(`No such directory: ${path.dirname(this.#filePath)}`)
            } else if (err.code = 'EACCES') {
                throw new NoPermission("Permission denied")
            }
        }
    }

    async write(str) {
        try {
            this.errStaleLock()
            await this.#lock.writeFile(str)           
        } catch (err) {
            console.error(err)
        }
    }

    async commit() {
        
        try {
            this.errStaleLock()

            await this.#lock.close()
            
            await fsPro.rename(this.#lockPath, this.#filePath)
            this.#lock = null
        } catch (err) {
            console.error(err);
        }
    }

    errStaleLock() {
        if (!this.#lock) {
            throw new StaleLock(`Not holding lock on file: ${this.#lockPath}`)
        }
    }

    toString() {
        return `${this.#filePath}
${this.#lockPath}
${this.#lock}`
    }


}



module.exports = Lockfile