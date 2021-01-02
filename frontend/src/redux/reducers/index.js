import LineItemReducer from './LineItemReducer'
import RegressionScreenReducer from './RegressionScreenReducer'
import ConfigReducer from './ConfigReducer'
import DistributionScreenReducer from './DistributionScreenReducer'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    LineItemReducer: LineItemReducer,
    RegressionScreenReducer: RegressionScreenReducer,
    ConfigReducer: ConfigReducer,
    DistributionReducer:DistributionScreenReducer
})

export default allReducers