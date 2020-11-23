import LineItemReducer from './LineItemReducer'
import RegressionScreenReducer from './RegressionScreenReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    LineItemReducer: LineItemReducer,
    RegressionScreenReducer: RegressionScreenReducer
})

export default allReducers