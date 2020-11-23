//reducer accepts action and changes the state accordingly
const RegressionScreenReducer = (regressionPoints = [], action) => {
    switch (action.type) {
        case 'ADD':
            regressionPoints = [...regressionPoints, action.payload]
            return regressionPoints

        case 'REMOVE':
            regressionPoints = regressionPoints.filter(item => item.id !== action.payload)
            return regressionPoints

        case 'UPDATE_COORDINATE':
            return regressionPoints.map((point, index) => {
                if (point.id == action.payload.id) {
                    console.log('changing value..', action.payload)
                    return {...point, value: action.payload.value}
                }
                return point
            })
                    
        default:
            return regressionPoints
    }
}
export default RegressionScreenReducer