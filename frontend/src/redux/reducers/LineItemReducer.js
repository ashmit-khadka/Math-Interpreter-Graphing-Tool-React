
//reducer accepts action and changes the state accordingly
const LineItemReducer = (LineItemArray = [], action) => {
    switch (action.type) {
        case 'INCREMENT':
            //console.log('hello???', action.payload, LineItemArray)
            LineItemArray.push(action.payload)
            return LineItemArray
        case 'DECREMENT':
            LineItemArray = LineItemArray.filter(item => item.props.id !== action.payload)
            return LineItemArray
        default:
            return LineItemArray
    }
}
export default LineItemReducer