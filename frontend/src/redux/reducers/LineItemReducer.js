
//reducer accepts action and changes the state accordingly
const LineItemReducer = (LineItemArray = [], action) => {
    switch (action.type) {
        case 'INCREMENT':
            //console.log('hello???', action.payload, LineItemArray)
            LineItemArray = [...LineItemArray, action.payload]
            return LineItemArray

        case 'DECREMENT':
            LineItemArray = LineItemArray.filter(item => item.id !== action.payload)
            return LineItemArray

        case 'UPDATE_COLOUR':
            return LineItemArray.map((LineItem, index) => {
                if (LineItem.id == action.payload.id) {
                    console.log('changing colour..')
                    return {...LineItem, colour: action.payload.colour}
                }
                return LineItem
            })

        case 'TOGGLE_VISIBILITY':
            return LineItemArray.map((LineItem, index) => {
                if (LineItem.id == action.payload.id) {
                    //console.log('changing visibility for..', action.payload.id, action.payload.visibility)
                    return {...LineItem, visible: action.payload.visibility}
                }
                return LineItem
            })

        default:
            return LineItemArray
    }
}
export default LineItemReducer