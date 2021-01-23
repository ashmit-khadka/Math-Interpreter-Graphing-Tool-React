//increment action for LineItems reducer.
export const setNotification = (notification) => {
    return {
        type:'SET_NOTIFICATION',
        payload: notification
    }
}

export const addNotification = (notification) => {
    return {
        type:'ADD_NOTIFICATION',
        payload: notification
    }
}

export const completeNotification = (id) => {
    return {
        type:'COMPLETE_NOTIFICATION',
        payload: id
    }
}

export const updateNotification = (data) => {
    return {
        type:'UPDATE_NOTIFICATION',
        payload: data
    }
}