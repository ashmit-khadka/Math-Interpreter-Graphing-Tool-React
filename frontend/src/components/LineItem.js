import React, { useState, useEffect } from 'react'
import SketchExample from './ColorPicker';
import { ReactComponent as IconRemove} from '../assets/icons/remove.svg'
import { ReactComponent as IconVisible} from '../assets/icons/binoculars.svg'
import { ReactComponent as IconHidden} from '../assets/icons/restriction.svg'
import { useDispatch } from 'react-redux';
import { decrement, updateColour, toggleVisibility } from '../redux/actions/LineItemActions'
import reactCSS from 'reactcss'


const LineItem = ({id, equation, colour, visible}) => {

    const [lineColour, setLineColour] = useState(colour)
    //const [visible, setVisible] = useState(true)

    const dispatch = useDispatch()

    const updateLineColour = col => {
        colour = col
        //console.log('new colour for', id, colour)
        dispatch(updateColour({id: id, colour: col}))

    }

    const toggleLineVisibility = () => {
        const newVisible =  visible ? false : true
        dispatch(toggleVisibility({id: id, visibility: visible ? false : true}))
    }
  
    return (

        <div className={visible ? 'line-item' : 'line-item hidden'}>
        
            <div className="flex-row line-item__row">
                {!visible && <IconHidden className=''/>}
                {visible && <SketchExample className="line-item__colour" colour={colour} onUpdate={updateLineColour}/>}
                <input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." defaultValue={"Line " + id}></input>
                <IconRemove className='line-item__icon' onClick={() => dispatch(decrement(id))}/>
            </div>
            <div className="flex-row">
                <span>f(x) =</span>    
                <input id="eq" type='text' className='line-item__input' name='equation' placeholder="e.g (4^2)*3+6" defaultValue={equation}></input>
                <IconVisible className='line-item__icon' onClick={toggleLineVisibility}/>
            </div>
        </div>
    )
}

export default LineItem