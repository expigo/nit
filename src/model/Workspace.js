const fs = require('fs')
const path = require('path')

class Workspace {
    #pathname

    constructor(path) {
        this.#pathname = path
    }


    listFiles(dir = this.#pathname, options = {}) {
        const locationsToIgnore = options.exclude 
        ? Workspace.IGNORE.concat(options.exclude)
        : Workspace.IGNORE 

        
        const dirHandle = fs.opendirSync(dir)
        var file
        var filenames = []
        while(file =  dirHandle.readSync()) {
          if(locationsToIgnore.includes(file.name)) {
              console.log('*SCAN* Skipping:', file.name);
              continue
          }
            filenames.push(file)
        }

        const entries = filenames.flatMap(dirent => {
            const filepath = path.join(dir, dirent.name)

            var entry = []
            try {
                if (fs.existsSync(filepath)) {
                  if(dirent.isDirectory()) {
                      entry = this.listFiles(filepath)
                    } else {
                    dirent.relativePath = path.relative(this.#pathname, filepath)
                    entry = dirent
                    }
                } else {
                }
              } catch(err) {
                console.error(err)
              }
            return entry
        })
        
        dirHandle.closeSync()
        return entries
    }

    readFile(relativePathToFile) {
        return fs.readFileSync(path.join(this.#pathname, relativePathToFile), { encoding: 'utf8' })
    }

    statFile(relativePathToFile) {
        return fs.statSync(path.join(this.#pathname, relativePathToFile), { encoding: 'utf8' })
    }



}

Workspace.IGNORE = ['.', '..', '.nit']

module.exports = Workspace