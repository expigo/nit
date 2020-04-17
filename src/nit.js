#!/usr/bin/env node

'use strict';

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const {resolveAbsolutePath} = require('./utils/index')
const Workspace = require('./model/Workspace')
const Database = require('./model/Database')
const Blob = require('./model/Blob')
const Entry = require('./model/Entry')
const Tree = require('./model/Tree')

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
        onCommit()

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
        process.exitCode = 1
    }

}

function onCommit() {

    const rootPath = resolveAbsolutePath(process.cwd())()
    const gitPath = path.join(rootPath, '.nit')
    const dbPath = path.join(gitPath, 'objects')

    if(!fs.existsSync(gitPath)) {     
        console.log('cwd is not a nit repo');
        process.exit(1)
    }


    const ws = new Workspace(rootPath)
    const database = new Database(dbPath)

    var entries = ws.listFiles().filter(file => !file.isDirectory()) // TODO: we need to go deeper! (store dirs as well)
                //   .map(file => file.name)
                  .map(function storeFile(file) {
                      var data = ws.readFile(file.name)
                      var blob = new Blob(data)

                    database.store(blob)

                    return new Entry(file.name, blob.id)
                  })


    const tree = new Tree(entries)
    database.store(tree)
    console.log(tree, entries.map(e => `${e.name}  ${e.id}`));

}
