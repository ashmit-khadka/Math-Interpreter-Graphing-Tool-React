import React, { useState, useEffect } from 'react';
import Graph from '../Graph';
import LineItem from '../LineItem'
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../../redux/actions/LineItemActions'

let lineID = 0

const GraphScreen = () => {    


    const [lines, setLines] = useState([])
    //const [lineItems, setLineItems] = useState([])
    const LineItems = useSelector(state => state.LineItemReducer) 
    const dispatch = useDispatch()

    const randomRGBA = () => {
        return {
            r: Math.floor(Math.random() * 255) + 1,
            g: Math.floor(Math.random() * 255) + 1,
            b: Math.floor(Math.random() * 255) + 1, 
            a: 1 
        }
    }

    const createEquation = () => {
        return {
            exponent: Math.floor(Math.random() * 4) + 0,
            c: Math.floor(Math.random() * 10) - 5,
        }
    }

    //updates/syncs lines for the graph based on LineItems.
    const updateLines = () => {
        console.log('updating..')
        let data = []
        LineItems.map(LineItem => {
            data.push({
                id: LineItem.props.id,
                colour: LineItem.props.colour,
                data: LineItem.props.data
            })            
        }) 
        setLines(data);
    } 

    
    const addItem = () => {

        const colour = randomRGBA()
        const eq = createEquation()
        const equation = `x^${eq.exponent}${eq.c < 0 ? eq.c : '+' + eq.c}`
        const data = []
        for(let i=-(50); i<=50; i++) {
            data.push(Math.pow(i, eq.exponent) - eq.c)
        }

        dispatch(increment(<LineItem key={++lineID} id={lineID} equation={equation} data={data} colour={colour} update={updateLines}/>))

        LineItems.map(LineItem => {
            //console.log(LineItem.props.colour)
        })

        
        setLines([...lines, {            
            id: lineID,
            colour: {r: colour.r, g: colour.g, b: colour.b, a: colour.a},
            data: data        
        }])

        //console.log('lines', lines)
    }
    
    useEffect(() => {
        //addItem()
    }, [])

    useEffect(() => {
        console.log('update lines..')
        updateLines()
    }, [LineItems])




    return (
        <div className="page graph-screen">
            <div className="graph-screen__panel">
                <button className='user-input--button' onClick={addItem}>New Line<IconAdd/></button>                
                <hr className="divider"></hr>

                {LineItems.map(item => item)}
            </div>
            <div className="graph-screen__graph">
                <Graph lines={lines}/>
            </div>

        </div>
    )
}

export default GraphScreen