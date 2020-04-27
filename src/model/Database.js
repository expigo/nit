const path = require('path')
const fs = require('fs')

class Database {
    #pathname

    constructor(path) {
        this.#pathname = path
    }

    
    store(object) {
        this.writeObject(this.#pathname, object.id, object.getContent())
    }

}

Database.prototype.writeObject = function(...args) {
    write.apply(this, args)
}


module.exports = Database



// ************************


function write(pathname, id, content) {

    var objectPath = path.join(pathname, id.slice(0, 2), id.slice(2))
    if (fs.existsSync(objectPath))  {
        console.log(`Object not changed since last commit. Skipping ${pathname}`);  // TODO: remove
        return
    }
    var dirname = path.dirname(objectPath)
    var tempPath = path.join(dirname, generateTempFilename())
    
    
    try {
        var fd = fs.openSync(tempPath, 'w+')
        
    } catch (err) {
        if (err.code == 'ENOENT') {
            fs.mkdirSync(dirname, { recursive: true })
            var fd = fs.openSync(tempPath, 'w+')
        }
    }  

    const buffer = require('zlib').deflateSync(content) 

    fs.writeFile(fd, buffer, err => {
        if (err) {
            console.error('An error occurred:', err);
            process.exitCode = 1;
            }
    })

    fs.renameSync(tempPath, objectPath)

}

function generateTempFilename() {
    return Math.random().toString(36).substr(2, 6);
}
