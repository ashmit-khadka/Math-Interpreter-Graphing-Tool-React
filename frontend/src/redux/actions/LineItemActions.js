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