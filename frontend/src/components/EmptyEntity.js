import React from 'react'
import { ReactComponent as IconAdd } from '../assets/icons/add.svg'
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/actions/NotificationActions'

const EmptyEntity = ({ reducer, actionAdd }) => {
    const dispatch = useDispatch()

    const addEntity = () => {
        console.log('test?')
        dispatch(actionAdd())
        dispatch(addNotification({'text':'Added new item', 'loader':false}))
    }

    return (
        <div className="screen__panel">
            <div className="empty-entity">
                <IconAdd className="icon-button empty-entity__add" onClick={addEntity}/>
                <label>Click to create new regression item</label>
            </div>
        </div>
    )
}


export default EmptyEntity