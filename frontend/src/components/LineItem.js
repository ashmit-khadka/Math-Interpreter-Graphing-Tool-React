import React from 'react'
import SketchExample from './ColorPicker';
import { ReactComponent as IconRemove} from '../assets/icons/remove.svg'
import { useDispatch } from 'react-redux';
import { decrement } from '../redux/actions/LineItemActions'


const LineItem = ({id, equation, colour}) => {

    const dispatch = useDispatch()
    
    return (
        <div className='line-item'>
            <SketchExample className="line-item__colour" colour={colour}/>
            <input id="eq" type='text' className='line-item__input' name='equation' placeholder="e.g (4^2)*3+6" value={equation}></input>
            <IconRemove className='line-item__remove' onClick={() => dispatch(decrement(id))}/>
        </div>
    )
}

export default LineItem