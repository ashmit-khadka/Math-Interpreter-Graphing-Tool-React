export const addDistributionItem = () => {
    return {
        type:'ADD_DISTRIBUTION_ITEM',
    }
}


export const removeDistributionItem = (id) => {
    return {
        type:'REMOVE_DISTRIBUTION_ITEM',
        payload: id
    }
}

export const editDistributionItem = (item) => {
    return {
        type:'EDIT_DISTRIBUTION_ITEM',
        payload: item
    }
}

export const setDistributionItemActive = (id) => {
    return {
        type:'SET_DISTRIBUTION_ITEM_ACTIVE',
        payload: id
    }
}

export const getDistributionItemActive = () => {
    return {
        type:'GET_DISTRIBUTION_ITEM_ACTIVE',
    }
}