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
    
    //Set make the selected tab active.
    const setTab = (id) => {
        setTabs(tabs.map(tab => 
            tab.id == id ? {...tab, active: true} : {...tab, active: false}
        ))
    }

    //document.getElementById("tab-colour").style.backgroundColor = props.redux.reducer[activeEnitiyIndex].colour
    return (
        <div className='tabs'>
            <div className='tabs__header'>
                {
                    tabs.map((tab, index) => {
                        return <button className={tab.active ? "tab__button tab__button--active": "tab__button"} key={index} onClick={() => setTab(tab.id)}>{tab.name}</button>
                    })
                }
            </div>
            <div className="tabs__content">

            {
                //Display the active tab
                tabs.map((tab, index) => {
                    if (tab.active) {
                        return <div key={index} className='tabs__tab'>{tab.component}</div>

                    }
                })
            }
            </div>

        </div>
    )
}


export default Tab