import React from 'react'
import { ReactComponent as IconCross} from '../assets/icons/cross.svg'
import { ReactComponent as IconSquare} from '../assets/icons/square.svg'
import { ReactComponent as IconMinus} from '../assets/icons/minus.svg'

const TitleBar = () => {
    return (
        <div className='title-bar'>
            <div className='title-bar__menu'>
                <button>File</button>
                <button>Edit</button>
                <button>Help</button>
            </div>
            <div className='title-bar__action'>
                <div className='title-bar__controll'>
                    <IconMinus className='title-bar__icon-controll'/>
                </div>
                <div className='title-bar__controll'>
                    <IconSquare className='title-bar__icon-controll'/>
                </div>
                <div className='title-bar__controll title-bar__controll--close'>
                    <IconCross className='title-bar__icon-controll'/>
                </div>
            </div>
        </div>
    )
}

export default TitleBar