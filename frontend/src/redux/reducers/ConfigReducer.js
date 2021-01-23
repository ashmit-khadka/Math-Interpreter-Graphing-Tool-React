//reducer accepts action and changes the state accordingly
const initialConfig = require('../../config.json')



const ConfigReducer = (config = initialConfig, action) => {
    switch (action.type) {

        case 'CONFIG_LOAD':
            config = action.payload
            return config        

        case 'SET_INTERPRETER_PATH':       
            console.log('updating path..', action.payload)     
            return {...initialConfig, interpeterPath: action.payload}
    
        case 'SET_CSV_HANDLER_PATH':
            console.log('updating path..', action.payload)     
            return {...initialConfig, CSVHandlerPath: action.payload}

        default:
            return config
    }
}
export default ConfigReducer