#!/usr/bin/env node

// const path = require('path');

// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/images', express.static(path.join( __dirname , 'images')));



// app.listen(3000, () => {
//     console.log('server listening on port 3000');
// })

const program = require('commander');
const inquirer = require('inquirer');

const newAppCommand= require('./commands/newApp.command');

program.version('1.0.0')
       .description('My first command line app');


const questions = [
    {
        type: 'input',
        name: 'appName',
        message: 'Enter AppName ...'
    }
]


program
    .command("new")
    .alias('n')
    .description('Enter the name of new app.')
    .action( () =>  {
        inquirer.prompt(questions)
        .then ((answers) => {
            newAppCommand.createNewApp(answers)
        })
    });

program.parse(process.argv);    