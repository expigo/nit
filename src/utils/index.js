const path = require('path')

const { Either } = require('../lib/types')
const { Left, Right, fromNullable } = Either


const resolveAbsolutePath = cwd => optRelative =>
    fromNullable(optRelative)
        .map(x => path.join(cwd, optRelative))
        .fold(()=> cwd, x=>x)


const mapify = obj =>  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v * v]));

    
module.exports = { resolveAbsolutePath, mapify }