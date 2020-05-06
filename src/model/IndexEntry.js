const { toBytesIntX, hexToBytes } = require('../utils/index')
const Entry = require('./Entry')


class IndexEntry {
    static MAX_PATH_SIZE = 0xfff
    static ENTRY_BLOCK = 8

    #entry

    constructor(entry) {
        this.#entry = entry
    }


    valueOf() {

        // console.log('🤕', this.#entry.stat)
        const mode = Buffer.from(toBytesInt32(parseInt(this.#entry.mode, 8)))
        const ctimeS = Buffer.from(toBytesInt32((this.#entry.stat.ctimeMs / BigInt(1000)).toString()))
        const ctimeNsFrac = Buffer.from(toBytesInt32((this.#entry.stat.ctimeNs % BigInt(1_000_000_000)).toString()))
        const mtimeS = Buffer.from(toBytesInt32((this.#entry.stat.mtimeMs / BigInt(1000)).toString()))
        const mtimeNsFrac = Buffer.from(toBytesInt32((this.#entry.stat.mtimeNs % BigInt(1_000_000_000)).toString()))
        const dev = Buffer.from(toBytesInt32(this.#entry.stat.dev.toString()))
        const inode = Buffer.from(toBytesInt32(this.#entry.stat.ino.toString()))
        const uid = Buffer.from(toBytesInt32(this.#entry.stat.uid.toString()))
        const gid = Buffer.from(toBytesInt32(this.#entry.stat.gid.toString()))
        const size = Buffer.from(toBytesInt32(this.#entry.stat.size.toString()))
        const id = Uint8Array.from(hexToBytes(this.#entry.id.toString()))
        const flags = Buffer.from(toBytesInt16(Math.min(Buffer.from(this.#entry.file, 'utf8').byteLength, IndexEntry.MAX_PATH_SIZE).toString()))
        const path = Buffer.from(this.#entry.file.padEnd('\0'))

        let structure = Buffer.concat([
            ctimeS, ctimeNsFrac,
            mtimeS, mtimeNsFrac,
            dev, inode, mode,
            uid, gid, size, 
            id, flags, path
        ])

        
        while(structure.byteLength % IndexEntry.ENTRY_BLOCK != 0) {
            structure = Buffer.concat([structure, Buffer.from('\0')])
        }


        return structure

    }

}

function toBytesInt32(num) {
    return toBytesIntX(32)(num)
} 
function toBytesInt16(num) {
    return toBytesIntX(16)(num)
} 

module.exports = IndexEntry