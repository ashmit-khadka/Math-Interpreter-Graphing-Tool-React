import React, { useState, useEffect } from 'react';
import Graph from '../Graph';
import GraphB from '../GraphB';
import LineItem from '../LineItem'
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../../redux/actions/LineItemActions'

let lineID = 0

const TestScreen = () => {    


    //const [lineItems, setLineItems] = useState([])
    const LineItems = useSelector(state => state.LineItemReducer) 
    const dispatch = useDispatch()

    const randomRGBA = () => {
        return {
            r: Math.floor(Math.random() * 255) + 50,
            g: Math.floor(Math.random() * 255) + 50,
            b: Math.floor(Math.random() * 255) + 50, 
            a: 1 
        }
    }
    
    const createEquation = () => {
        return {
            exponent: Math.floor(Math.random() * 4) + 0,
            c: Math.floor(Math.random() * 10) - 5,
        }
    }

    //console.log('rendering..')

        
    const addItem = () => {

        const colour = randomRGBA()
        const eq = createEquation()
        const equation = `x^${eq.exponent}${eq.c < 0 ? eq.c : '+' + eq.c}`
        const data = []
        
        for(let i=-(5000); i<=5000; i++) {
            data.push({x: i, y: Math.pow(i, eq.exponent) + eq.c})
        }

        //dispatch(increment(<LineItem key={++lineID} id={lineID} equation={equation} data={data} colour={colour} update={updateLines}/>))

        dispatch(increment({
            id: ++lineID,
            data: data,
            equation: equation,
            colour: colour,
            visible: true
        }))
    }
    
    useEffect(() => {
        addItem()
    }, [])

    useEffect(() => {
        //console.log('..........')
    }, [LineItems])


    return (
        <div className="page graph-screen">
            <div className="graph-screen__panel">
                <button className='user-input--button' onClick={addItem}>New Line<IconAdd/></button>                
                <hr className="divider"></hr>
                {LineItems.map(item => {
                    return <LineItem key={item.id} id={item.id} equation={item.equation} data={item.data} colour={item.colour} visible={item.visible}/>
                })}
            </div>
            <div className="graph-screen__graph">
                <GraphB lines={LineItems}/>
            </div>

        </div>
    )
}

export default TestScreen