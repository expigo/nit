const Lockfile = require('./Lockfile')
const Entry = require('./Entry')
const IndexEntry = require('./IndexEntry')
const { toBytesIntX } = require('../utils/index')

const crypto = require('crypto')

class Index {
    static VERSION = 2
    
    #entries
    #lockfile
    #hash

    constructor(pathname) {
        this.#entries = new Map()
        this.#lockfile = new Lockfile(pathname)
    }

    add(file, blobId, stat) {
        const entry = new IndexEntry(new Entry(file, blobId, stat))
        this.#entries.set(file, entry)
    }


    async writeUpdates() {

            if(!(await this.#lockfile.holdForUpdate())){
                return false
            }

            
            this.beginWrite()
            const header = Buffer.concat([Buffer.from("DIRC"), toBytesIntX(32)(2), toBytesIntX(32)(this.#entries.size)])
            await this.write(header)

            for (var [key, value] of this.#entries) {
                await this.write(value)
            }
            await this.finishWrite()
        }
        
    beginWrite() {
        this.#hash = crypto.createHash('sha1')
    }
    
    async write(data) {
        const d = data.valueOf()
        await this.#lockfile.write(d)
        this.#hash.update(d)
    }

    async finishWrite() {
        await this.#lockfile.write(this.#hash.digest())
        await this.#lockfile.commit()
    }
}


module.exports = Index

// https://github.com/git/git/blob/master/Documentation/technical/index-format.txt
