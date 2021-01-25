import { execShellCommand } from './threader'
//redux
import { useSelector } from 'react-redux';

export const CSVFileReader = (type, CSVHandlerPath) => {
    return new Promise((resolve, reject) => {
        const dialog = window.require("electron").remote.dialog
        dialog.showOpenDialog({
            title: "Please select a data file.",
            properties: ["openFile"],
            filters: [{name: "Comma Separated File (CSV)", extensions: ["csv"]}]
        }).then((response) => {
            if (!response.canceled) {  
                const args = type.concat([response.filePaths[0]])
                console.log('reading file.. ', args)  
                execShellCommand(CSVHandlerPath, args)
                .then(response => { console.log(response); resolve(response) })
                //.catch(reject('na'))
            } else {
                reject();
            }
        })
    })
}


export const CSVFileWritter = (type, data, CSVHandlerPath) => {
    return new Promise((resolve, reject) => {
        const dialog = window.require("electron").remote.dialog
        dialog.showSaveDialog({ 
            title: 'Select the File Path to save', 
            buttonLabel: 'Save', 
            filters: [{name: 'Comma Separated File (CSV)', extensions: ['csv']},], 
            properties: [] 
        }).then((response) => {
            if (!response.canceled) {
                const args = type.concat(JSON.stringify({"data":data, "path":response.filePath.toString()}))              
                execShellCommand(CSVHandlerPath, args)
                .then(response => { console.log(response); resolve(response) })                
            } else {
                reject();
            }
        })
    })
}

export const SystemFileReader = () => {
    return new Promise((resolve, reject) => {
        const dialog = window.require("electron").remote.dialog
        dialog.showOpenDialog({
            title: "Please select a data file.",
            properties: ["openFile"],
            filters: [{name: 'Graph File', extensions: ['gph']},], 
        }).then((response) => {
            if (!response.canceled) { 
                const fs = window.require('fs');
                try {
                    const entities = JSON.parse(fs.readFileSync(response.filePaths[0], 'utf8'))
                    resolve(entities)
                } catch (e) {
                    reject(e);
                }           
                  
            } else {
                reject();
            }
        })
    })
}

export const SystemFileWritter = (data) => {
    return new Promise((resolve, reject) => {
        const dialog = window.require("electron").remote.dialog
        dialog.showSaveDialog({ 
            title: 'Select the File Path to save', 
            buttonLabel: 'Save', 
            filters: [{name: 'Graph File', extensions: ['gph']},], 
            properties: [] 
        }).then((response) => {
            if (!response.canceled) {  
                console.log(data)
                const fs = window.require('fs');
                fs.writeFileSync(response.filePath.toString(), data, (err,data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                  }
                )
            } else {
                reject();
            }
        })
    })
}





export default CSVFileReader