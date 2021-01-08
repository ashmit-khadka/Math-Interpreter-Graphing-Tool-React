import React, { useState } from 'react'
import SketchExample from './ColorPicker';
import { ReactComponent as IconMore } from '../assets/icons/more.svg'
import { ReactComponent as IconClose } from '../assets/icons/cross.svg'
import { ReactComponent as IconAdd } from '../assets/icons/add.svg'
import { ReactComponent as IconRemove } from '../assets/icons/remove.svg'
import { ReactComponent as IconPen } from '../assets/icons/pen.svg'
import { ReactComponent as IconTick } from '../assets/icons/tick.svg'
import { ReactComponent as IconVisibility } from '../assets/icons/binoculars.svg'
import { addNotification } from '../redux/actions/NotificationActions'

import { useDispatch } from 'react-redux';

const Tab = (props) => {

    const initTabs = props.tabs
    initTabs.forEach((tab, index) => {
        tab['id'] = index
        tab['active'] = index ? false : true
    })    
    const [ tabs, setTabs ] = useState(initTabs)

    //Get current active item index.
    let activeEnitiyIndex = props.redux.reducer.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }

    //console.log('selected..', activeEnitiyIndex)
    
    //Set make the selected tab active.
    const setTab = (id) => {
        setTabs(tabs.map(tab => 
            tab.id == id ? {...tab, active: true} : {...tab, active: false}
        ))
    }

    //Show list
    const showList = () => {
        document.getElementById('tab-list').classList.remove('hide')
    }
//                <SketchExample className="line-item__colour" colour={props.redux.reducer[activeEnitiyIndex].colour}/>


    //document.getElementById("tab-colour").style.backgroundColor = props.redux.reducer[activeEnitiyIndex].colour
    const idStyle = {backgroundColor: `rgba(${props.redux.reducer[activeEnitiyIndex].colour.r},${props.redux.reducer[activeEnitiyIndex].colour.g},${props.redux.reducer[activeEnitiyIndex].colour.b},${props.redux.reducer[activeEnitiyIndex].colour.a})`}
    return (
        <div className='tabs'>
            <div className='tab__title' onClick={showList}>
                <div id={"tab-colour"} className="tab__colour" style={idStyle}></div>
                <h2>{props.redux.reducer[activeEnitiyIndex].title}</h2>
                <IconMore/>
            </div>
            <div className='tabs__header'>
                {
                    tabs.map((tab, index) => {
                        return <button className={tab.active ? "tab__button tab__button--active": "tab__button"} key={index} onClick={() => setTab(tab.id)}>{tab.name}</button>
                    })
                }
            </div>

            {
                //Display the active tab
                tabs.map((tab, index) => {
                    if (tab.active) {
                        return <div key={index} className='tabs__tab'>{tab.component}</div>

                    }
                })
            }
                            {<TabList
                    redux={props.redux}
                />}
        </div>
    )
}

const TabList = (props) => {

    const dispatch = useDispatch()

    const addNewItem = () => {
        dispatch(props.redux.action_add())
        dispatch(addNotification({'text':'Added new item', 'loader':false}))

    }

    const hide = () => {
        document.getElementById('tab-list').classList.add('hide')
    }

    return (
        <div id='tab-list' className='model__background hide'>

            <div className='model__content'>
                <div className="model__control">
                    <div></div>
                    <IconClose onClick={hide}/>
                </div>
                {
                    props.redux.reducer.map((item, index) => {
                        return <TabListItem 
                            key={item.id}
                            id={index}
                            item={item}
                            redux={props.redux}
                        />
                    })
                }
                <IconAdd onClick={addNewItem}/>
            </div>
        </div>
    )
}

//List Item Component.
const TabListItem = (props) => {
    //console.log(props.item)
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false)
    
    //Function to remove this list item.
    const removeItem = () => {
        dispatch(props.redux.action_remove(props.item.id))
        dispatch(addNotification({'text':'Removed item', 'loader':false}))

    }

    //Enable edit mode.
    const editItem = () => { setEditMode(true) }

    //Save edit.
    const saveItem = () => { 
        const newtitle = document.getElementById('tab-list-item-title-'+ props.item.id).value
        dispatch(props.redux.action_edit({...props.item, title: newtitle}))
        setEditMode(false)
    }

    //Updated the colour.
    const updateColour = (colour) => {
        dispatch(props.redux.action_edit({...props.item, colour: colour}))
    }

    //Change the selected item.
    const selectItem = () => {
        dispatch(props.redux.action_select(props.item.id))
    }

    //Toggle visibility
    const toggleVisibility = () => {
        dispatch(props.redux.action_edit({...props.item, visible: !props.item.visible}))
    }

    return (
        <div className="tab-item" onClick={selectItem}>
            <div className="tab-item__detail">
                <SketchExample className="line-item__colour" colour={props.item.colour} onUpdate={updateColour}/>
                {
                    editMode ? 
                    <input id={'tab-list-item-title-'+ props.item.id} type='text' className='line-item__input' defaultValue={props.item.title}></input> :
                    <h3>{props.item.title}</h3>
                }
                
            </div>
            <div className="tab-item__control">
                {
                    editMode ?
                    <IconTick onClick={saveItem}/>:
                    <IconPen onClick={editItem}/>
                }
                {<IconVisibility className={props.item.visible ? "" : "icon--disabled" } onClick={toggleVisibility}/>}
                <IconRemove onClick={removeItem}/>
            </div>
        </div>
    )
}

export default Tab