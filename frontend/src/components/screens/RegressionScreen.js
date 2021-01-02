import React, { useState, useEffect } from 'react';
import Graph from '../Graph';
import GraphB from '../GraphB';
import LineItem from '../LineItem'
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../../assets/icons/saving-disc.svg'
import {execShellCommand} from '../../scripts/threader'
import CSVFileReader from '../../scripts/fileReader'

import Tab from '../Tab'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addRegressionEntity, updateRegressionEntity, removeRegressionEntity, selectRegressionEntity } from '../../redux/actions/RegressionScreenActions'

//CSV handler
//import { threadCMD } from '../../scripts/threader'

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
                //dispatch(updateCoordinate({id:props.id, value:{x:e.target.value, y:data.y}}))
            }
            if (v==='y') {
                setData({x:data.x, y:e.target.value})
                //dispatch(updateCoordinate({id:props.id, value:{x:data.x, y:e.target.value}}))
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

    const regressionEntities = useSelector(state => state.RegressionScreenReducer)
    //Get current active item index.
    let activeRegressionEnitiyIndex = regressionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeRegressionEnitiyIndex < 0) { activeRegressionEnitiyIndex = 0 }

    return (
        <div className="page screen">
            <div className="screen__panel">
                <Tab 
                    tabs={[
                        {
                            'name':'Analysis',
                            'component': <AnalysisTab/>,
                        },
                        {
                            'name':'Data',
                            'component': <DataTab/>,
                        }
                    ]}
                    redux={{
                        'reducer': regressionEntities,
                        'action_select': selectRegressionEntity,
                        'action_edit': updateRegressionEntity,
                        'action_remove': removeRegressionEntity ,
                        'action_add': addRegressionEntity,
                    }}
                />
                
                <hr className="divider"></hr>
                
            </div>
            <div className="graph-screen__graph">
                <GraphB points={regressionEntities[activeRegressionEnitiyIndex].points}
                    lines={
                        [regressionEntities[activeRegressionEnitiyIndex].line]
                    }
                />
            </div>
        </div>
    )
}


const AnalysisTab = () => {

    const regressionEntities = useSelector(state => state.RegressionScreenReducer)
    const dispatch = useDispatch()

    //Get current active item index.
    let activeRegressionEnitiyIndex = regressionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeRegressionEnitiyIndex < 0) { activeRegressionEnitiyIndex = 0 }

    const [analysis, setAnalysis] = useState({
        a: '-',
        b: '-',
        r: '-',
        xbar: '-',
        ybar: '-',
        data: [],
    }) 


    const analyse = () => {
        //console.log(JSON.stringify(regressionPoints))
        
        let data = []
        regressionEntities[activeRegressionEnitiyIndex].points.map(point => {
            data.push(point.value)
        })
        console.log(JSON.stringify(data))

        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe"
            , [
                JSON.stringify(data)      
        ]).then(response => {
            //console.log('r line', regressionEntities[activeRegressionEnitiyIndex].line)
            const data = {
                id: 0,
                data: [
                    {x:-1000, y:(response.a * -1000 + response.b)},
                    {x:1000, y:(response.a * 1000 + response.b)},
                ],
                equation: '',
                colour: {r: 100, g: 10, b: 10, a: 1},
                visible: true
            }
            //console.log(data)
            setAnalysis({...analysis, a:response.a, b:response.b, r: response.r, xbar:response.xbar, ybar:response.ybar})
            dispatch(updateRegressionEntity({...regressionEntities[activeRegressionEnitiyIndex], line: data}))
        });


    }

    return (
        <div>
                <label>Regression Line:</label>    
                <span>y =</span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." value={analysis.a==='-'? analysis.a : `${analysis.a}x+${analysis.b}`}></input>
                <label>Corelation Coefficient:</label>    
                <span>r =</span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." value={analysis.r}></input>
                <label>x-bar:</label>    
                <span>x̅ =</span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." value={analysis.xbar}></input>
                <label>y-bar:</label>    
                <span>y̅ =</span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." value={analysis.ybar}></input>

                <button className='user-input--button' onClick={analyse}>Analyse</button>                

        </div>
    )
}


const DataTab = (props) => {
    const regressionPoints = useSelector(state => state.RegressionScreenReducer)
    const config = useSelector(state => state.ConfigReducer)
    const dispatch = useDispatch()

    //Get current active item index.
    let activeRegressionEnitiyIndex = regressionPoints.findIndex(item => {
        return item.active === true
    })
    if (activeRegressionEnitiyIndex < 0) { activeRegressionEnitiyIndex = 0 }



    const readFile = () => {
        const dialog = window.require("electron").remote.dialog

        CSVFileReader(config.ACTION_READ_REGRESSION_FILE, config.CSVHandlerPath)
        .then(response => {   
            let points = []
            response.data.forEach((point, index) => {
                points.push({'id':index, 'value':point})
            }) 
            dispatch(updateRegressionEntity({...regressionPoints[activeRegressionEnitiyIndex], points: points}))
        })
    }

    
    return (
        <div>
                <IconOpenFile className="control__icon" onClick={readFile}/>
                <IconSaveFile className="control__icon control__icon--disabled"/>                
                <div className="regression__data">
                    <DataHeader/>
                    {regressionPoints[activeRegressionEnitiyIndex].points.map(point => {
                        return <DataRow key={point.id} id={point.id} value={point.value}/>
                    })}
                    <IconAdd className="control__icon"/>

                
                </div>
        </div>
    )
}

export default RegressionScreen