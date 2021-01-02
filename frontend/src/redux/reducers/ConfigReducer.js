//reducer accepts action and changes the state accordingly
const initialConfig = {
    'interpeterPath': 'C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\Interpreter\\Interpreter\\bin\\Debug\\netcoreapp3.1\\Interpreter.exe',
    'CSVHandlerPath': 'C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\Tools\\CSV_Handler\\bin\\Debug\\netcoreapp3.1\\CSV_Handler.exe',
    'ACTION_READ_REGRESSION_FILE': 'read-regression',
    'ACTION_READ_DISTRIBUTION_FILE': 'read-distrabution',
}

const ConfigReducer = (config = initialConfig, action) => {
    switch (action.type) {
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