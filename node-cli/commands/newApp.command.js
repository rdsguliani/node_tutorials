const fs = require('fs')
const path = require('path')
const { exec, spawn } = require('child_process')
var process = require('process');

let location = '';

const template = `
    const path = require('path');

    const express = require('express');
    const bodyParser = require('body-parser');

    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/images', express.static(path.join( __dirname , 'images')));



    app.listen(3000, () => {
        console.log('server listening on port 3000');
    });`

exports.createNewApp = async function(options) {
    // console.log(options.appName);
    //create folder
    try {
        const dirName = options.appName + '_app'
        location = path.join( __dirname, '..', dirName)
        console.log('Creating app at location :: ' + location);
        let result = await createDir(location);
        console.log(result);
        //adding images directory.

        const ilocation = path.join( __dirname, '..', dirName, 'images')
        result = await createDir(ilocation);
        console.log('Images ' + result);
        
        // create npm init command
        result = await initializeNPM();
        console.log(result);
        
        //creat main file.
        

    } catch (e ) {
        console.log(e);
    }

}


function createDir (name) {
    return new Promise( (resolve, reject ) => {
            fs.mkdir(name, {recursive: true}, (err, result) => {
            if(err) {
                reject('App Already Exists')
            }
            resolve('directory created successfully !!!!');
        })
    })      
}

function initializeNPM() {
    process.chdir(location);
    return new Promise( (resolve, reject) => {
        exec('npm init -y', (err, stdout, stdin) => {
    
            if(err)  {
                reject(err)
            }
            console.log('npm initialized ')
            return resolve('npm initialized !!')
        })
    }).then( () => {
        return new Promise( (resolve, reject) => {
            console.log('updating ...')
            exec('ls', ( (err, stdout) => {
                console.log('err'  +err);
                console.log('stdout ' + stdout);
            }));
            exec('npm set init.scripts.start "node index.js" ' , (err, stdout, stdin) => {
        
                if(err)  {
                    reject(err)
                }
                
                return resolve('updating !!')
            })
        })
    }).then( () => {
        return new Promise( (resolve, reject) => {
            console.log('installling package .... ')
            exec('npm install express nodemon body-parser', (err, stdout, stdin) => {
        
                if(err)  {
                    reject(err)
                }

                console.log(stdout);
                

                console.log('pakages installed initialized**')
                return resolve('pakages installed !!')
            })
        })
    })
    .then ( () => {
        return new Promise( (resolve, reject) => {

            fs.readFile(('package.json'), (err, result) => {
                if(err) {
                    reject('Error creating index file')
                }
                console.log(result)
                const data= JSON.parse(result);
                console.log(data)
                data.scripts.start = 'node index.js'

                resolve(data);
            })

        })
    })
    .then ( (NewPackageFile) => {
        return new Promise( (resolve, reject) => {
            
            fs.writeFile(('package.json'), JSON.stringify(NewPackageFile, null, 4), (err, result) => {
                if(err) {
                    reject('Error updating package file')
                }
                resolve('pacakge file updated successfully !!');
            })

        })
    })
    .then ( () => {
        return new Promise( (resolve, reject) => {

            fs.writeFile(('index.js'), template, (err, result) => {
                if(err) {
                    reject('Error creating index file')
                }
                resolve('app launched successfully !!');
            })

        })
    })
}

