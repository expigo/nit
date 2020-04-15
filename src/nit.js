#!/usr/bin/env node

'use strict';
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

var parseArgs = require("minimist")(process.argv.slice(2), {
    boolean: ["help"],
    // string: ["init"]
})

if(parseArgs.help) {
    printHelp()
} else if(parseArgs._[0] == 'init') {

    var rootPath = parseArgs._[1] || process.cwd()
    var gitPath = path.join(rootPath, '.nit');

    if(fs.existsSync(gitPath)) {
        console.log(`Repo already initialized in: ${gitPath}`);
        process.exit(0)
    }

    ['objects', 'refs'].forEach(dir => {
        fs.mkdir(path.join(gitPath, dir), { recursive: true }, function mkdirError(err, path) {
            if (err) {
                console.log(`ERROR creating directory: ${path}`);
                throw err;
            }
        })
    });
    console.log(`Successfully initialized empty Nit repo in : ${gitPath}`);
} else {
    console.log('not init');
}


// ******************
function printHelp() {
    console.log(chalk.underline.blue.italic('nit usage:'))
    console.log('    nit --help')
    console.log()
    console.log('--help         prints this help');  
    console.log('init           initialize new repo');  
    console.log()
}