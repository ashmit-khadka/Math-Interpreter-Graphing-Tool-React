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
        'analysis': {},
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
        'visible':true,

    },
    {
        'id': 2,
        'type':'regression',
        'title': 'Example Reg Data 2',
        'colour': {r: 188, g: 123, b: 119, a: 1},
        'data': [],
        'analysis': {},
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },
        'active':false,
        'visible':true,
    },
    {
        'id': 3,
        'type':'regression',
        'title': 'Example Reg Data 3',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': [],
        'analysis': {},
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },
        'active':false,
        'visible':true,
    },

    {
        'id': 4,
        'type':'distribution',
        'title': 'Example Data 1',
        'colour': {r: 108, g: 193, b: 189, a: 1},
        'data': [],
        'analysis': {},
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        'active':true,
        'visible':true,

    },
    {
        'id': 5,
        'type':'distribution',
        'title': 'Example Data 2',
        'colour': {r: 188, g: 123, b: 119, a: 1},
        'data': [],
        'analysis': {},
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        'active':false,
        'visible':true,
    },
    {
        'id': 6,
        'type':'distribution',
        'title': 'Example Data 3',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': [],
        'analysis': {},
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        'active':false,
        'visible':true,
    },
    {
        'id': 7,
        'type':'polynomial',
        'title': 'Example Data 1',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': [],
        'analysis': {},
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        
        'active':true,
        'visible':true,
    }
]

let entityIdCounter = initalData.length


const EntityReducer = (entities = initalData, action) => {
    switch (action.type) {
        case 'ADD_ENTITY':
            entityIdCounter++
            entities = [...entities, {...action.payload, id:entityIdCounter, title:'New Entity '+entityIdCounter}]
            return entities
    
        case 'SELECT_ENTITY':
            return entities.map(item => {
                if (item.id == action.payload) {
                    return {...item, active:true}
                }
                return {...item, active:false}
            })

        case 'REMOVE_ENTITY':
            entities = entities.filter(item => item.id !== action.payload)
            return entities

        case 'UPDATE_ENTITY':
            console.log('editting..', action.payload)
            return entities.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                }
                return item
            })
        
                    
        default:
            return entities
    }
}
export default EntityReducer