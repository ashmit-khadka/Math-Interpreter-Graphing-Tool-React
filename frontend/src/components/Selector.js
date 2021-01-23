import React, { useState } from 'react'
import SketchExample from './ColorPicker';
import { ReactComponent as IconMore } from '../assets/icons/more.svg'
import { ReactComponent as IconClose } from '../assets/icons/cross.svg'
import { ReactComponent as IconAdd } from '../assets/icons/add.svg'
import { ReactComponent as IconRemove } from '../assets/icons/remove.svg'
import { ReactComponent as IconPen } from '../assets/icons/pen.svg'
import { ReactComponent as IconTick } from '../assets/icons/tick.svg'
import { ReactComponent as IconVisibility } from '../assets/icons/binoculars.svg'
import { ReactComponent as IconUp } from '../assets/icons/up.svg'
import { addNotification } from '../redux/actions/NotificationActions'

import { useDispatch } from 'react-redux';

const Selector = ({ reducer, actionSelect, actionEdit, actionRemove, actionAdd }) => {

    //Get current active item index.
    let activeEnitiyIndex = reducer.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }

    //console.log('selected..', activeEnitiyIndex)
    

    //Show list
    const showList = () => {
        document.getElementById('selector-list').classList.remove('hide')
    }
//                <SketchExample className="line-item__colour" colour={props.redux.reducer[activeEnitiyIndex].colour}/>


    //document.getElementById("tab-colour").style.backgroundColor = props.redux.reducer[activeEnitiyIndex].colour
    const idStyle = {backgroundColor: `rgba(${reducer[activeEnitiyIndex].colour.r},${reducer[activeEnitiyIndex].colour.g},${reducer[activeEnitiyIndex].colour.b},${reducer[activeEnitiyIndex].colour.a})`}
    return (
        <div className='selector'>
            <div className='selector__title' onClick={showList}>
                <div className="selector__colour" style={idStyle}></div>
                <h2>{reducer[activeEnitiyIndex].title}</h2>
                <IconMore className='icon-button'/>

            </div>  

            {<SelectorList
                reducer={reducer}
                actionSelect={actionSelect}
                actionEdit={actionEdit}
                actionRemove={actionRemove}
                actionAdd={actionAdd}  
            />}
        </div>
    )
}

const SelectorList = ({ reducer, actionSelect, actionEdit, actionRemove, actionAdd }) => {

    const dispatch = useDispatch()

    const addNewItem = () => {
        dispatch(actionAdd())
        dispatch(addNotification({'text':'Added new item', 'loader':false}))

    }

    const hide = () => {
        document.getElementById('selector-list').classList.add('hide')
    }

    return (
        <div id='selector-list' className='model__background hide'>
            <div className='model__content selector-list'>
            <IconUp className='icon-button' onClick={hide}/>

                <div className="model__control">
                    <div></div>
                </div>
                {
                    reducer.map((item, index) => {
                        return <SelectorListItem 
                            key={item.id}
                            item={item}
                            reducer={reducer}
                            actionSelect={actionSelect}
                            actionEdit={actionEdit}
                            actionRemove={actionRemove}
                            hide={hide}
                        />
                    })
                }
                <IconAdd className='icon-button' onClick={addNewItem}/>
            </div>
        </div>
    )
}

//List Item Component.
const SelectorListItem = ({ item, actionSelect, actionEdit, actionRemove, hide }) => {
    //console.log(props.item)
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false)
    
    //Function to remove this list item.
    const removeItem = () => {
        dispatch(actionRemove(item.id))
        dispatch(addNotification({'text':'Removed item', 'loader':false}))

    }

    //Enable edit mode.
    const editItem = () => { setEditMode(true) }

    //Save edit.
    const saveItem = () => { 
        const newtitle = document.getElementById('selector-list-item-title-'+ item.id).value
        dispatch(actionEdit({...item, title: newtitle}))
        setEditMode(false)
    }

    //Updated the colour.
    const updateColour = (colour) => {
        dispatch(actionEdit({...item, colour: colour}))
    }

    //Change the selected item.
    const selectItem = (e) => {
        if (e.target !== undefined && e.target.id === "select-item")
        {
            dispatch(actionSelect({"type":item.type, "id":item.id}))
            hide()
        }

    }

    //Toggle visibility.
    const toggleVisibility = () => {
        dispatch(actionEdit({...item, visible: !item.visible}))
    }

    return (
        <div className="selector-item" id='select-item' onClick={selectItem}>
            <div className="selector-item__detail">
                <SketchExample className="line-item__colour" colour={item.colour} onUpdate={updateColour}/>
                {
                    editMode ? 
                    <input id={'selector-list-item-title-'+ item.id} type='text' className='line-item__input' defaultValue={item.title}></input> :
                    <h3>{item.title}</h3>
                }
                
            </div>
            <div className="selector-item__control">
                {
                    editMode ?
                    <IconTick className='icon-button' onClick={saveItem}/>:
                    <IconPen className='icon-button' onClick={editItem}/>
                }
                {<IconVisibility className={item.visible ? "icon-button" : "icon-button icon--disabled" } onClick={toggleVisibility}/>}
                <IconRemove className='icon-button' onClick={removeItem}/>
            </div>
        </div>
    )
}

export default Selector