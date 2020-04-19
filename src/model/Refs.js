const fs = require('fs')
const path = require('path')

class Refs {
    #pathname
    #headPath

    constructor(pathname) {
        this.#pathname = pathname
        this.#headPath = path.join(this.#pathname, 'HEAD')
    }

    updateHead(id) {
        const flag = fs.constants.O_WRONLY | fs.constants.O_CREAT
        fs.writeFile(this.#headPath, id,  { 
            flag,
            mode: '0644'
         }, err => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        })
    }

    readHead() {
       if (fs.existsSync(this.#headPath)) {
           var head = fs.readFileSync(this.#headPath, 'utf8')
       }
       return head
    }
}

module.exports = Refs