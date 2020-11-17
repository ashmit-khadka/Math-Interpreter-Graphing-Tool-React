import LineItemReducer from './LineItemReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    LineItemReducer: LineItemReducer
})

export default allReducers