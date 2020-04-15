#!/usr/bin/env node

'use strict';

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const {resolveAbsolutePath} = require('./utils/index')
const Workspace = require('./model/Workspace')

var parseArgs = require("minimist")(process.argv.slice(2), {
    boolean: ["help"],
    // string: ["init"]
})

if(parseArgs.help) {
    printHelp()
}

switch (parseArgs._[0]) {
    case 'init':
        repoInit(parseArgs._[1])
        break;
    case 'commit':

        const rootPath = resolveAbsolutePath(process.cwd())()
        const gitPath = path.join(rootPath, '.nit')
        const dbPath = path.join(gitPath, 'objects')

        if(!fs.existsSync(gitPath)) {     
            console.log('cwd is not a nit repo');
            process.exit(1)
        }


        const ws = new Workspace(rootPath)
        console.log(ws.listFiles());

        break;
    default:
        error(`Not a nit command: ${parseArgs._[0]}`)

}


// ******************
function printHelp() {
    console.log(chalk.underline.blue.italic('nit usage:'))
    console.log('    nit --help')
    console.log()
    console.log('--help         prints this help');  
    console.log('init [dir]     initialize new repo');  
    console.log('commit         commit changes');  
    console.log()
    process.exit(0)
}

function error(msg, includeHelp = false) {
    console.error(msg)
    if(includeHelp) {
        console.log()
        printHelp()
    }
}

function repoInit(optRelativePath) {
    var rootPath = resolveAbsolutePath(process.cwd())(optRelativePath)
    var gitPath = path.join(rootPath, '.nit')

    if(!fs.existsSync(gitPath)) {     
        ['objects', 'refs'].forEach(dir => fs.mkdirSync(path.join(gitPath, dir), { recursive: true }))
    } else {
        console.info(`Repo already initialized in: ${gitPath}`);
        process.exit(126)
    }

    if(fs.existsSync(gitPath)) {
        console.log(`Successfully initialized empty Nit repo in : ${gitPath}`);
    } else {
        console.error('Something went wrong ... 🤷‍♂');
        process.exit(1)
    }
    
    process.exit(0)
}
