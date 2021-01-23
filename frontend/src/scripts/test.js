
/*

class threader {

    constructor() {
        this.maxThreads = 50  
        this.threadQueue = []
        this.activeThreadQueue = []
        this.threadId = 0
    }

    addToThreadQueue = (item) => {
        threadQueue.push({
            "id": threadId++,
            "args": item
        })
    }
    
    

    static execShellCommand = (path, args) => {
        let cmd = JSON.stringify(path)
        args.forEach(element => {
            cmd += ' ' + JSON.stringify(element)
            .replace(/"\\"/g, "'")
            .replace(/\\""/g, "'")
            .replace("^", "^^")
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
}
*/

const checkJSON = (string) => {
    try {
        const json = JSON.parse(string)
        if (json && typeof json === 'object') { return json }            
    }
    catch (e) { return false }
}

const execShellCommand = (path, args) => {

    let cmd = JSON.stringify(path)
    args.forEach(element => {
        cmd += ' ' + JSON.stringify(element)
        .replace(/"\\"/g, "'")
        .replace(/\\""/g, "'")
        .replace("^", "^^")
    });

    console.log(cmd)
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {

        exec(cmd, (error, stdout, stderr) => {
            if (stdout)
            {
                //console.log(stdout)
                const response = checkJSON(stdout)
                if (response) { resolve(response) } 
            }
            if (error) { return reject(error) }
            if (stderr) { return reject(stderr) }
            reject('generic error')            
        });

    });
}



execShellCommand(
    "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\New\\Interpreter\\Interpreter\\bin\\Debug\\net461\\Interpreter.exe",
    [
        "expression",
        "[\"5*6\"]"
    ]
).then(response => {
    console.log(response)
})

execShellCommand(
    "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\New\\Interpreter\\Interpreter\\bin\\Debug\\net461\\Interpreter.exe",
    [
        "expression",
        "[\"x=4\",\"x*6\"]"
    ]
).then(response => {
    console.log(response)
})


console.log("test")