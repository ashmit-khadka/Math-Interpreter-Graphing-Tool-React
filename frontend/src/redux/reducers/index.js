import LineItemReducer from './LineItemReducer'
import RegressionScreenReducer from './RegressionScreenReducer'
import ConfigReducer from './ConfigReducer'
import DistributionScreenReducer from './DistributionScreenReducer'
import EntityReducer from './EntityReducer'
import NotificationReducer from './NotificationReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    LineItemReducer: LineItemReducer,
    RegressionScreenReducer: RegressionScreenReducer,
    ConfigReducer: ConfigReducer,
    DistributionReducer:DistributionScreenReducer,
    EntityReducer:EntityReducer,
    NotificationReducer:NotificationReducer,
})

export default allReducers