
//Check string is valid JSON.
const checkJSON = (string) => {
    try {
        const json = JSON.parse(string)
        if (json && typeof json === 'object') { return json }            
    }
    catch (e) { return false }
}

export const threadCMD = (path, args) => {

    let cmd = JSON.stringify(path)
    args.forEach(element => {
        cmd += ' ' + JSON.stringify(element)
    });

    //const exec = window.require('child_process').exec;
    const { exec } = require('child_process');
    const child = exec(cmd);   
    return child
}



//Spawn new thread for command.
export const execShellCommand = (path, args) => {

    let cmd = JSON.stringify(path)
    args.forEach(element => {
        cmd += ' ' + JSON.stringify(element).replace(/"\\"/g, "'").replace(/\\""/g, "'")
    });

    console.log(cmd)
    const exec = window.require('child_process').exec;
    return new Promise((resolve, reject) => {

        exec(cmd, (error, stdout, stderr) => {
            if (stdout)
            {
                const response = checkJSON(stdout)
                if (response) { resolve(response) } 
            }
            if (error) { return reject(error) }
            if (stderr) { return reject(stderr) }
            reject('generic error')            
        });

    });
}

const readReadDistributionFile = (path) => {

}


/*
const path = 'C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\Tools\\CSV_Handler\\bin\\Debug\\netcoreapp3.1\\CSV_Handler.exe'
const args = [
    "read-regression",
    "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\Data\\Regression.csv"      
]
console.log('test')

let cmd = JSON.stringify(path)
args.forEach(element => {
    cmd += ' ' + JSON.stringify(element)
});



execShellCommand(cmd)
.then(response => {console.log(response, 'stdout')})
.catch(response => {console.log(response, 'stderr')})
*/