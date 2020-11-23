import React, { useState, useEffect } from 'react';
import Graph from '../Graph';
import GraphB from '../GraphB';
import LineItem from '../LineItem'
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { add, updateCoordinate } from '../../redux/actions/RegressionScreenActions'

let PointID = 0

const DataHeader = (props) => {
    return (
        <div className="data-row">
            <div className="data-row__cell data-row__cell--num">
            </div>
            <div className="data-row__cell data-row__cell--header">
                <input className="input-text" type="text" defaultValue="x"></input>
            </div>
            <div className="data-row__cell data-row__cell--header">
                <input className="input-text" type="text" defaultValue="y"></input>
            </div>
        </div>
    )
}

const DataRow = (props) => {
    
    const dispatch = useDispatch()

    const [data, setData] = useState({
        'x': props.value.x,
        'y': props.value.y
    })



    const onChange = (e,v) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            if (v==='x') {
                setData({x:e.target.value, y:data.y})
                dispatch(updateCoordinate({id:props.id, value:{x:e.target.value, y:data.y}}))
            }
            if (v==='y') {
                setData({x:data.x, y:e.target.value})
                dispatch(updateCoordinate({id:props.id, value:{x:data.x, y:e.target.value}}))
            }
        }
        console.log(data)
    }

    useEffect(() => {

    },[data])

    return (
        <div className="data-row">
            <div className="data-row__cell data-row__cell--num">
                <span>{props.id}</span>
            </div>
            <div className={"data-row__cell"}>
                <input className="input-text" type="text" value={data.x} onChange={(e) => onChange(e, 'x')}></input>
            </div>
            <div className="data-row__cell">
                <input className="input-text" type="text" value={data.y} onChange={(e) => onChange(e, 'y')}></input>
            </div>
        </div>
    )
}



const RegressionScreen = () => {    

    const regressionPoints = useSelector(state => state.RegressionScreenReducer)
    const dispatch = useDispatch()

 
    const addDataRow = () => {
        dispatch(add({
            id: PointID++,
            value: {
                x: '',
                y: ''
            }
        }))
    }

    useEffect(() => {
        for (let i=0; i<3; i++) {
            dispatch(add({
                id: PointID++,
                value: {
                    x: i,
                    y: i*2
                }
            }))
        }
    }, [])
//                    <IconAdd onClick={addDataRow}/>

    return (
        <div className="page screen">
            <div className="screen__panel">
                <label>Regression Line:</label>    
                <span>y =</span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." value={"-"}></input>
                <label>Corelation Coefficient:</label>    
                <span>r =</span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." value={"-"}></input>
                <hr className="divider"></hr>

                <div className="regression__data">
                    <DataHeader/>
                    {regressionPoints.map(point => {
                        return <DataRow key={point.id} id={point.id} value={point.value}/>
                    })}
                    <IconAdd onClick={addDataRow}/>
                </div>
            </div>
            <div className="graph-screen__graph">
                <GraphB points={regressionPoints} lines={[]}/>
            </div>
        </div>
    )
}

export default RegressionScreen