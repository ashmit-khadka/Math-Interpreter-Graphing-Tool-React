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
        'analysis': {
            'r':2.45437545
        },
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
        'analysed':false
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
        'analysed':false
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
        'analysed':false
    },

    {
        'id': 4,
        'type':'distribution',
        'title': 'Example Datatest 1',
        'colour': {r: 108, g: 193, b: 189, a: 1},
        'data': [
            {x: 175},
            {x: 173},
            {x: 188},
            {x: 172},
            {x: 162},
            {x: 175},
            {x: 196},
            {x: 164},
            {x: 184},
            {x: 176},
            {x: 181},
            {x: 193},
        ],
        'analysis': {
            'type': 'sample',
            'mean': null,
            'variance': null,
            'sd':null,
            'SeMean':null,
            'size':null,
            'sum':null,
            'pdCurve':[],
            'rank':null,
            'percentile':null,
            'rankRequest':null,
            'percentileRequest':null,
            'probability': {
                'type':'none',
                'domain1':null,
                'domain2':null,
                'value':null,
            },
        },
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        
        'active':true,
        'visible':true,
        'analysed':false
    },
    {
        'id': 5,
        'type':'distribution',
        'title': 'Example Data 2',
        'colour': {r: 188, g: 123, b: 119, a: 1},
        'data': [],
        'analysis': {
            'type': 'sample',
            'mean': null,
            'variance': null,
            'sd':null,
            'SeMean':null,
            'size':null,
            'sum':null,
            'pdCurve':[],
            'rank':null,
            'percentile':null,
            'rankRequest':null,
            'percentileRequest':null,
            'probability': {
                'type':'none',
                'domain1':null,
                'domain2':null,
                'value':null,
            },
        },
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        
        'active':false,
        'visible':true,
        'analysed':false
    },
    {
        'id': 6,
        'type':'polynomial',
        'title': 'New Line 1',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': [],
        'analysis': {
            'parsed': false,
            'expression': null,
            'function':null,
            'variables':null
        },
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        
        'active':true,
        'visible':true,
        'analysed':false
    },

    {
        'id': 7,
        'type':'polynomial',
        'title': 'New Line 2',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': [],
        'analysis': {
            'analysed': false,
            'expression': '2*x+5',
            'function':'x',
            'variables': {
                'x':5,
                'c':6
            }
        },
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        
        'active':true,
        'visible':true,
        'analysed':false
    },
    {
        'id': 8,
        'type':'interpreter',
        'title': 'Example Data 1',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': {
            "symbols":[
                {
                    "Variable":"x",
                    "Value":"5"
                },
                {
                    "Variable":"c",
                    "Value":"3"
                },
            ],
            'history':[
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
                {
                    "type":"Assignment",
                    "value":"x=5",
                    "result":"-"
                },
                {
                    "type":"Expression",
                    "value":"2*x+c",
                    "result":"15"
                },
            ]
        },
        'analysis': {},
        'elements': {
            'lines': [],
            'dots': [],
            'areas': [],
        },        
        'active':true,
        'visible':true,
        'analysed':false
    }
]

let entityIdCounter = initalData.length


const selectEntity = (entities, type, id) => {
    return entities.map(item => {
        if (item.type === type &&  item.id === id)
        { return {...item, active:true} }   
        else if (item.type === type &&  item.id !== id)
        { return {...item, active:false} }
        return item
    })
}

const EntityReducer = (entities = initalData, action) => {
    switch (action.type) {

        case 'ADD_ENTITY':
            entityIdCounter++
            entities = [...entities, {...action.payload, id:entityIdCounter, title:'New Entity '+entityIdCounter}]
            return selectEntity(entities, action.payload.type, entityIdCounter)
    
        case 'SELECT_ENTITY':
            console.log('selecting... ',action.payload.id)
            return selectEntity(entities, action.payload.type, action.payload.id)

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
            
        case 'LOAD_ENTITIES':
            entities = action.payload
            return entities     
        default:
            return entities
    }
}
export default EntityReducer