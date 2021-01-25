//reducer accepts action and changes the state accordingly


const initalData = [
   {
        'id': 1,
        'type':'interpreter',
        'title': 'Example Data 1',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'data': {
            "symbols":[],
            'history':[]
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

let entityIdCounter = initalData.length > 0 ? initalData[initalData.length-1].id + 1 : 0


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