//increment action for LineItems reducer.
export const add = (LineItem) => {
    return {
        type:'ADD',
        payload: LineItem
    }
}

export const remove = (LineItemID) => {
    return {
        type:'REMOVE',
        payload: LineItemID
    }
}

//data = {x, y}
export const updateCoordinate = (data) => {
    return {
        type:'UPDATE_COORDINATE',
        payload: data
    }
}


//data = {id, boolean}
export const toggleVisibility = (data) => {
    return {
        type:'TOGGLE_VISIBILITY',
        payload: data
    }
}