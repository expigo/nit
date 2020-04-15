#!/usr/bin/env node

'use strict';
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

var parseArgs = require("minimist")(process.argv.slice(2), {
    boolean: ["help"],
    // string: ["init"]
})

if(parseArgs._[0] == 'init') {
    console.log('init', parseArgs._[1] || process.cwd())

    var root_path = parseArgs._[1] || process.cwd()
    var git_path = path.join(root_path, '.nit');

    ['objects', 'refs'].forEach(dir => {
        fs.mkdir(path.join(git_path, dir), { recursive: true }, function mkdirError(err) {
            if (err) throw err;
        })
    });
} else {
    console.log('not init');
}

console.log(parseArgs);
printHelp()

// ******************
function printHelp() {
    console.log(chalk.underline.blue.italic('nit usage:'))
    console.log('    nit --help')
    console.log()
    console.log('--help         prints this help');  
    console.log('init           initialize new repo');  
    console.log()
}