//reducer used to communicate with the graph componenet.
const initialGraphConfig = 
{
    'reset':false,
    'defaultRegion': {
        'range': [-1000, 1000],
        'domain': [-1000, 1000],
    }
}

const GraphReducer = (graphConfig = initialGraphConfig, action) => {
    switch (action.type) {
        case 'RESET_GRAPH_ON':   
            return {...graphConfig, reset:true}
        case 'RESET_GRAPH_OFF':            
            return {...graphConfig, reset:false}
        default:
            return graphConfig
    }
}
export default GraphReducer