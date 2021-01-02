//increment action for LineItems reducer.
export const addRegressionEntity = (entity) => {
    return {
        type:'ADD_REGRESSION_ENTITY',
        payload: entity
    }
}

export const selectRegressionEntity = (entityId) => {
    return {
        type:'SELECT_REGRESSION_ENTITY',
        payload: entityId
    }
}

export const updateRegressionEntity = (entity) => {
    return {
        type:'UPDATE_REGRESSION_ENTITY',
        payload: entity
    }
}

export const removeRegressionEntity = (entityId) => {
    return {
        type:'REMOVE_REGRESSION_ENTITY',
        payload: entityId
    }
}




//data = {id, boolean}
export const toggleVisibility = (data) => {
    return {
        type:'TOGGLE_VISIBILITY_REGRESSION_ENTITY',
        payload: data
    }
}