import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setInterpreter, setCSVHandler } from '../../redux/actions/ConfigActions'

const dialog = window.require("electron").remote.dialog

const SettingScreen = () => {


    const config = useSelector(state => state.ConfigReducer) 
    const dispatch = useDispatch()

    const [interpreterPath, setInterpreterPath] = useState()

    const openFile = (currentPath) => {
        return dialog.showOpenDialog({
            title: "Please specify an executable.",
            defaultPath: currentPath,
            properties: ["openFile"],
            filters: [{name: "Executable", extensions: ["exe"]}]
        })      
    }

    const selectInterpreter = (path) => {
        openFile(path)
        .then((response) => {
            if (!response.canceled) {
                dispatch(setInterpreter(response.filePaths[0]))
            } else {
                return null;
            }
        }) 
    }

    const selectCSVHander = (path) => {
        openFile(path)
        .then((response) => {
            if (!response.canceled) {
                dispatch(setCSVHandler(response.filePaths[0]))
            } else {
                return null;
            }
        }) 
    }

    return (
            <div className="setting-screen control">
                <div className="control__container">
                    <label>Interpreter:</label>
                    <input id="eq" type='text' className='' name='equation' placeholder="Specify interpreter.." value={config.interpeterPath}></input>
                    <button onClick={() => selectInterpreter(config.interpeterPath)}>...</button>

                </div>
                <div className="control__container">
                    <label>CSV file handler:</label>
                    <input id="eq" type='text' className='' name='equation' placeholder="Specify CSV File handler.." value={config.CSVHandlerPath}></input>
                    <button onClick={() => selectCSVHander(config.CSVHandlerPath)}>...</button>
                </div>
            </div>

    )
}

export default SettingScreen