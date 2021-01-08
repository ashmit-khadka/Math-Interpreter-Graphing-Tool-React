//increment action for LineItems reducer.
export const addEntity = (entity) => {
    return {
        type:'ADD_ENTITY',
        payload: entity
    }
}

export const selectEntity = (entityId) => {
    return {
        type:'SELECT_ENTITY',
        payload: entityId
    }
}

export const updateEntity = (entity) => {
    return {
        type:'UPDATE_ENTITY',
        payload: entity
    }
}

export const removeEntity = (entityId) => {
    return {
        type:'REMOVE_ENTITY',
        payload: entityId
    }
}


export const toggleVisibility = (id) => {
    return {
        type:'TOGGLE__VISIBILITY',
        payload: id
    }
}