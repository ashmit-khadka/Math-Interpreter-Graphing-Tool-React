//reducer accepts action and changes the state accordingly


const initalData = [
    {
        'id': 1,
        'type':'regression',
        'title': 'Example Reg Data 1',
        'colour': {r: 108, g: 193, b: 189, a: 1},
        'data': [
            {'x': 10,'y':20},
            {'x': 20,'y':25},
            {'x': 30,'y':32}
        ],
        'elements': {
            'lines': [],
            'dots': [
                {'x': 10,'y':20},
                {'x': 20,'y':25},
                {'x': 30,'y':32}
            ],
            'areas': [],
        },
        'active':true,
        'visable':true,

    },
    {
        'id': 2,
        'type':'regression',
        'title': 'Example Reg Data 2',
        'colour': {r: 188, g: 123, b: 119, a: 1},
        'data': [],
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },
        'active':false,
        'visable':true,
    },
    {
        'id': 3,
        'type':'regression',
        'title': 'Example Reg Data 3',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': [],
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },
        'active':false,
        'visable':true,
    }
]

let regressionEntityIdCounter = initalData.length


const RegressionScreenReducer = (regressionEntities = initalData, action) => {
    switch (action.type) {
        case 'ADD_REGRESSION_ENTITY':
            regressionEntityIdCounter++
            regressionEntities = [...regressionEntities, {
                'id': regressionEntityIdCounter,
                'title': 'Example Data ' + regressionEntityIdCounter,
                'colour': {r: 148, g: 123, b: 159, a: 1},
                'points': [],
                'active':false,
                'visable':true,
            }]
            return regressionEntities
    
        case 'SELECT_REGRESSION_ENTITY':
            return regressionEntities.map(item => {
                if (item.id == action.payload) {
                    return {...item, active:true}
                }
                return {...item, active:false}
            })

        case 'REMOVE_REGRESSION_ENTITY':
            regressionEntities = regressionEntities.filter(item => item.id !== action.payload)
            return regressionEntities

        case 'UPDATE_REGRESSION_ENTITY':
            console.log('editting..', action.payload)
            return regressionEntities.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                }
                return item
            })
        
                    
        default:
            return regressionEntities
    }
}
export default RegressionScreenReducer