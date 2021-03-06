//reducer accepts action and changes the state accordingly
const initialStatus = {
    'text': '',
}

/*
const initialNotification = [
    {
        'id':0,
        'text':'Example 1',
        'notified': false,
        'loader': false
    },
    {
        'id':1,
        'text':'Example 2',
        'notified': false,
        'loader': false
    }
]
*/
const initialNotification = [

]


let notificationId = initialNotification.length - 1

const NotificationReducer = (notifications = initialNotification, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':            
        notifications = action.payload
            //console.log('set status..', status)
            return notifications

        case 'ADD_NOTIFICATION':       
            notificationId++
            notifications = [...notifications, {
                'id':notificationId,
                'text':action.payload.text,
                'notified': false,
                'loader': action.payload.loader
            }]
            console.log('added status..')
            return notifications

        case 'COMPLETE_NOTIFICATION':
            console.log('notifications..', notifications)
            return notifications.map(item => {
                if (item.id == action.payload) {
                    return {...item, notified:true}
                }
                return item
            })

        case 'UPDATE_NOTIFICATION':
            //console.log('notifications..', notifications)
            return notifications.map(item => {
                if (item.id == action.payload.id) {
                    return {...item, text:action.payload.text}
                }
                return item
            })

        default:
            return notifications
    }
}
export default NotificationReducer