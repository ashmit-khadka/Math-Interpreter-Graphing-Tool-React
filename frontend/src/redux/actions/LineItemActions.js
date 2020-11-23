//increment action for LineItems reducer.
export const increment = (LineItem) => {
    return {
        type:'INCREMENT',
        payload: LineItem
    }
}

export const decrement = (LineItemID) => {
    return {
        type:'DECREMENT',
        payload: LineItemID
    }
}

//data = {id, colour}
export const updateColour = (data) => {
    return {
        type:'UPDATE_COLOUR',
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