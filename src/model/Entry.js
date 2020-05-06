var path = require("path")

class Entry{
    // git distinguishes only two file modes:
    static REGULAR_MODE = '100644'
    static EXECUTABLE_MODE = '100755'
    static DIRECTORY_MODE = '40000'

    #file
    #id
    #stat
    constructor(file, id, stat) {
        this.#file = file
        this.#id = id
        this.#stat = stat
    }


 

    parentDirectories() {
        const splitted = path.dirname(this.relativePath).split(path.sep)
        if(splitted == '.') return []
        const d = []
        let last = ''
      
        function append(splitted) {
          const temp = splitted.shift()
          last = path.join(last, temp)
          d.push(path.normalize(last))
          if (splitted.length <= 0) {
            return d
          } else return append(splitted)
        }

        return append(splitted)
      }

    valueOf() {
        return `xxx ${this.#file.relativePath}  ${this.#id}`
    }


    get mode() {
        return this.#stat.mode.toString(8).slice(3).startsWith(7)
         ? Entry.EXECUTABLE_MODE
         : Entry.REGULAR_MODE
    }
    get name() {
        return this.#file.name   
    }

    get relativePath() {
        return this.#file.relativePath
    }
    

    get id() {
        return this.#id   
    }

    get file() {
        return this.#file
    }
    
    get stat() {
        return this.#stat
    }
    
}

module.exports = Entry