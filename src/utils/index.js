const path = require('path')

const { Either } = require('../lib/types')
const { Left, Right, fromNullable } = Either


const resolveAbsolutePath = cwd => optRelative =>
    fromNullable(optRelative)
        .map(x => path.join(cwd, optRelative))
        .fold(()=> process.cwd(), x=>x)

    
module.exports = { resolveAbsolutePath }