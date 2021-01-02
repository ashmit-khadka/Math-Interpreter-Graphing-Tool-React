//increment action for config reducer.

export const setInterpreter = (path) => {
    return {
        type:'SET_INTERPRETER_PATH',
        payload: path
    }
}

export const setCSVHandler = (path) => {
    return {
        type:'SET_CSV_HANDLER_PATH',
        payload: path
    }
}