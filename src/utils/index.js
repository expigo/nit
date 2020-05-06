const path = require('path')

const { Either } = require('../lib/types')
const { Left, Right, fromNullable } = Either


const resolveAbsolutePath = cwd => optRelative =>
    fromNullable(optRelative)
        .map(x => path.join(cwd, optRelative))
        .fold(()=> cwd, x=>x)



function toBytesIntX (width) {
    return function(num) {
        const setUintX = `setUint${width}`
        const widthInBytes = width / 8
        arr = new ArrayBuffer(widthInBytes);
        view = new DataView(arr);
        view[setUintX](0, num, false); // byteOffset = 0; litteEndian = false
        return Buffer.from(arr);
    }
}


function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

    
module.exports = { resolveAbsolutePath, toBytesIntX, hexToBytes }