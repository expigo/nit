#!/usr/bin/env node

'use strict';
const chalk = require('chalk')


printHelp()

// ******************
function printHelp() {
    console.log(chalk.underline.blue.italic('nit usage:'))
    console.log('    nit --help')
    console.log()
    console.log('--help         prints this help');  
    console.log()
}