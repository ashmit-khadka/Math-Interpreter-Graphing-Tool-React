import { execShellCommand } from './threader'
//redux
import { useSelector } from 'react-redux';

const CSVFileReader = (type, CSVHandlerPath) => {
    return new Promise((resolve, reject) => {
        const dialog = window.require("electron").remote.dialog
        dialog.showOpenDialog({
            title: "please select a data file.",
            properties: ["openFile"],
            filters: [{name: "Comma Separated File (CSV)", extensions: ["csv"]}]
        }).then((response) => {
            if (!response.canceled) {  
                console.log('reading file.. ', response.filePaths[0])              
                execShellCommand(CSVHandlerPath, [
                    type,
                    response.filePaths[0]      
                ])
                .then(response => { console.log(response); resolve(response) })
                //.catch(reject('na'))
            } else {
                reject();
            }
        })
    })
}

export default CSVFileReader