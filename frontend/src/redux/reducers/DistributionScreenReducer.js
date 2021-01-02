
const initalData = [
    {
        'id': 1,
        'title': 'Example Data 1',
        'colour': {r: 108, g: 193, b: 189, a: 1},
        'points': [],
        'active':true,
        'visable':true,

    },
    {
        'id': 2,
        'title': 'Example Data 2',
        'colour': {r: 188, g: 123, b: 119, a: 1},
        'points': [],
        'active':false,
        'visable':true,
    },
    {
        'id': 3,
        'title': 'Example Data 3',
        'colour': {r: 148, g: 123, b: 159, a: 1},
        'points': [],
        'active':false,
        'visable':true,
    }
]

let idConter = initalData.length


//reducer accepts action and changes the state accordingly
const DistributionScreenReducer = (distributionItems = initalData, action) => {
    switch (action.type) {
        case 'ADD_DISTRIBUTION_POINT':
            //console.log('adding point..', action.payload)
            distributionItems = [...distributionItems, action.payload]
            return distributionItems
    
        case 'SET_DISTRIBUTION_POINT':
            //console.log('setting distributionItems..', action.payload)
            distributionItems = action.payload
            return distributionItems

        case 'REMOVE_DISTRIBUTION_POINT':
            distributionItems = distributionItems.filter(item => item.id !== action.payload)
            return distributionItems

        case 'ADD_DISTRIBUTION_ITEM':
            idConter++
            distributionItems = [...distributionItems, {
                'id': idConter,
                'title': 'Example Data ' + idConter,
                'colour': {r: 148, g: 123, b: 159, a: 1},
                'points': [],
                'active':false,
                'visable':true,
            }]
            return distributionItems

        case 'REMOVE_DISTRIBUTION_ITEM':
            distributionItems = distributionItems.filter(item => item.id !== action.payload)
            return distributionItems

        case 'EDIT_DISTRIBUTION_ITEM':
            console.log('editting..', action.payload)
            return distributionItems.map(item => {
                if (item.id == action.payload.id) {
                    return action.payload
                }
                return item
            })
        
        //set payload id as active entity item.
        case 'SET_DISTRIBUTION_ITEM_ACTIVE':
            //console.log('setting active item..', action.payload)
            return distributionItems.map(item => {
                if (item.id == action.payload) {
                    return {...item, active:true}
                }
                return {...item, active:false}
            })

        case 'GET_DISTRIBUTION_ITEM_ACTIVE':
            return distributionItems.findIndex(item => {
                return item.active === true
            })

        case 'UPDATE_DISTRIBUTION_POINT':
            return distributionItems.map((point, index) => {
                if (point.id == action.payload.id) {
                    //console.log('changing value..', action.payload)
                    return {...point, value: action.payload.value}
                }
                return point
            })
                    
        default:
            return distributionItems
    }
}
export default DistributionScreenReducer