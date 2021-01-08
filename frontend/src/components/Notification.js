import React, { useState, useEffect } from 'react'
import { ReactComponent as IconClose } from '../assets/icons/cross.svg'

import { useDispatch, useSelector } from 'react-redux';
import { completeNotification } from '../redux/actions/NotificationActions'

let statusCount = 0


const Notification = () => {


    const notifications = useSelector(state => state.NotificationReducer)
    const notificationStack = notifications.find(item => !item.notified)    
       
    const dispatch = useDispatch()

    const nextNotification = notifications.find(item => !item.notified)

    //console.log(nextNotification)

    useEffect(() => {

        /*
        if (statusCount > 0)
            document.getElementById('notification').classList.add('notification__show')
        statusCount += 1
        */
            //hideStatusTimed(])
        //console.log('showing..')

        if (nextNotification !== undefined)
        show()
        setTimeout(() => {
                hide()
                //console.log('hiding..')

        }, 2000)
    


    })


    const show = () => {
        const notificationBody = document.getElementById('notification')
        notificationBody.classList.add('notification__show')
    }

    const hide = () => {
        document.getElementById('notification').classList.remove('notification__show')
        if (nextNotification !== undefined) dispatch(completeNotification(nextNotification.id))
    }


    



    return (
        <div id="notification" className="notification">
            <h2>{notificationStack && notificationStack.text}</h2>
            <IconClose className="icon-button icon-button--small"/>
        </div>
    )
}


export default Notification