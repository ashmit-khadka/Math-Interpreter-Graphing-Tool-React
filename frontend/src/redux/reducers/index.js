import ConfigReducer from './ConfigReducer'
import EntityReducer from './EntityReducer'
import NotificationReducer from './NotificationReducer'
import GraphReducer from './GraphReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    ConfigReducer: ConfigReducer,
    EntityReducer:EntityReducer,
    NotificationReducer:NotificationReducer,
    GraphReducer:GraphReducer,
})

export default allReducers