import React, { useState, useEffect } from 'react';
import GraphB from '../GraphB';
import Tab from '../Tab';
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../../assets/icons/saving-disc.svg'
import {execShellCommand} from '../../scripts/threader'
import CSVFileReader from '../../scripts/fileReader'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addDistributionItem, removeDistributionItem, editDistributionItem, setDistributionItemActive } from '../../redux/actions/DistributionScreenActions'


const DataHeader = (props) => {
    return (
        <div className="data-row">
            <div className="data-row__cell data-row__cell--num">
            </div>
            <div className="data-row__cell data-row__cell--header">
                <input className="input-text" type="text" defaultValue="x"></input>
            </div>
        </div>
    )
}

const DataRow = (props) => {
    
    const dispatch = useDispatch()

    const [data, setData] = useState({
        'value': props.value,
    })



    const onChange = (e,v) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            if (v==='x') {
                setData({x:e.target.value, y:data.y})
                //dispatch(updateDistributionPoint({id:props.id, value:{x:e.target.value, y:data.y}}))
            }
            if (v==='y') {
                setData({x:data.x, y:e.target.value})
                //dispatch(updateDistributionPoint({id:props.id, value:{x:data.x, y:e.target.value}}))
            }
        }
        //console.log(data)
    }

    useEffect(() => {

    },[data])

    return (
        <div className="data-row">
            <div className="data-row__cell data-row__cell--num">
                <span>{props.id}</span>
            </div>
            <div className={"data-row__cell"}>
                <input className="input-text" type="text" value={data.value} onChange={(e) => onChange(e, 'x')}></input>
            </div>
        </div>
    )
}

let PointID = 0 
let sample = [165,177,188,178,182,172,186,168,174,183,181,193] 

const DistrabutionScreen = () => {

    const distributionEntity = useSelector(state => state.DistributionReducer)
    const dispatch = useDispatch()
    const [lines, setLines] = useState([])
    const [areas, setAreas] = useState([])
    const [currentEntityId, setCurrentEntityId] = useState(0)

    //dummy values for debugging
    useEffect(() => {

            const points = sample.map(element => {
                return {
                    id: PointID++,
                    value: element,
                }
            })
        
            console.log(points)
            dispatch(editDistributionItem({
                'id': distributionEntity[0].id,
                'title': distributionEntity[0].title,
                'colour': distributionEntity[0].colour,
                'points': points
            }))
   
    }, [])


    return (
        <div className="page screen">
            <div className="screen__panel">
                <Tab 
                    tabs={[
                        {
                            'name':'Analysis',
                            'component': <AnalysisTab setLines={setLines} areaObjects={areas} setAreas={setAreas} currentEntityId={currentEntityId}/>,
                        },
                        {
                            'name':'Data',
                            'component': <DataTab/>,
                        }
                    ]}
                    reducer={distributionEntity}
                    addTabListItemAction={addDistributionItem}
                    removeTabListItemAction={removeDistributionItem}
                    editTabListItemAction={editDistributionItem}
                    setCurrentEntityId={setCurrentEntityId}
                    currentEntityId={currentEntityId}
                    redux={{
                        'reducer': distributionEntity,
                        'action_select': setDistributionItemActive,
                        'action_edit': editDistributionItem,
                        'action_remove': removeDistributionItem,
                        'action_add': addDistributionItem,
                    }}
                />

                <hr className="divider"></hr>

            </div>
            <div className="graph-screen__graph">
                <GraphB points={[]} lines={[lines]} areaObjects={areas}/>
            </div>
        </div>
    )
}

const AnalysisTab = ({setLines, setAreas, areaObjects, currentEntityId }) => {

    let lineYVals = []
    const distributionPoints = useSelector(state => state.DistributionReducer)
    const [analysis, setAnalysis] = useState({
        'mean': 0,
        'variance': 0,
        'probability': 0
    })

    const randomRGBA = () => {
        return {
            r: Math.floor(Math.random() * 255) + 50,
            g: Math.floor(Math.random() * 255) + 50,
            b: Math.floor(Math.random() * 255) + 50, 
            a: 1 
        }
    }

    const analyse = () => {

        let data = []

        
        //console.log('points..', distributionPoints)
        distributionPoints[0].points.map(point => {
            data.push(point.value)
        })
        //console.log(JSON.stringify(data))
    
        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore - Dist\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe",
            ["st_Norm", JSON.stringify(data)] 
        )
        .then(response => {
            console.log('values..', response.density)
            setLines({
                id: 1,
                data: response.density,
                equation: '',
                colour: distributionPoints[currentEntityId].colour,
                visible: true
            })
            lineYVals = response.density

            setAnalysis({
                'mean': response.mean,
                'variance': response.variance
            })
            //test()
        })
    }


    //Create an area where 150<x<170
    const test = (xLower, xUpper) => {
        //console.log('creating area..')
        const interval = (xUpper - xLower) / 10
        let domain = []
        for (let i = xLower; i <= xUpper; i += interval) { domain.push(i) }
        const args = {'mean': analysis.mean, 'variance': analysis.variance, 'domain': domain}
        //console.log(JSON.stringify(args))
        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore - Dist\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe",
            ['st_Norm_curve', args] 
        )
        .then(response => {
            setAreas(...areaObjects, [response.density])
        })          
    }

    const getProbability = () => {
        //console.log(JSON.stringify(regressionPoints))
        const selectedType = document.getElementById("probabilityType").value
        const xVar1 = document.getElementById("xVal1").value 
        const xVar2 = document.getElementById("xVal2").value 
        setAreas([])



        let requestData = {}

        switch (selectedType) {
            case 'st_CP_GT':
                requestData = {"mean":analysis.mean,"variance":analysis.variance,"value1":xVar1}
                test( parseFloat(xVar1), parseFloat(200))
                break;
            case 'st_CP_LET':
                requestData = {"mean":analysis.mean,"variance":analysis.variance,"value1":xVar1,}
                test( parseFloat(0), parseFloat(xVar1))
                break;
            case 'st_CP_BTW':
                requestData = {"mean":analysis.mean,"variance":analysis.variance,"value1":xVar1,"value2":xVar2}
                test( parseFloat(xVar1), parseFloat(xVar2))
                

                break;
            case 'st_CP_OUT':
                requestData = {"mean":analysis.mean,"variance":analysis.variance,"value1":xVar1,"value2":xVar2}
                test( parseFloat(0), parseFloat(xVar1))
                test( parseFloat(xVar2), parseFloat(200))

                break;
        }

        console.log('getting results for..', selectedType)

        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore - Dist\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe",
            [selectedType, requestData] 
        ). then(response => {
            console.log(response)

        })      
    }
    //console.log('areas..', areaObjects)
  
    return (
        <div className='tab'>
            <label>Mean (μ):</label>    
            <span></span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." defaultValue={analysis.mean}></input>
            <label>Variance (σ):</label>    
            <span></span><input id="eq" type='text' className='line-item__input' name='equation' placeholder="Enter name.." defaultValue={analysis.variance}></input>
            <button className='user-input--button' onClick={analyse}>Analyse</button>  
            

            <div className="">
                <label>Probability Calculation:</label>

                <select name="probabilityType" id="probabilityType">
                    <option value="st_CP_GT">{"P(X > x)"}</option>
                    <option value="st_CP_LET">{"P(X < x)"}</option>
                    <option value="st_CP_BTW">{"P( x < X < y)"} </option>
                    <option value="st_CP_OUT">{"P( X < x1) & P(X > x2)"}</option>
                </select>
                <label>x1</label>    
                <input id="xVal1" type='text' className='line-item__input' name='equation' placeholder="Enter x value.." defaultValue={175}></input>
                <label>x2</label>
                <input id="xVal2" type='text' className='line-item__input' name='equation' placeholder="Enter x value.." defaultValue={185} ></input>

                <button className='user-input--button' onClick={getProbability}>Probability</button>  

            </div>

        </div>
    )
}


const DataTab = () => {

    //Redux.
    const dispatch = useDispatch()
    const config = useSelector(state => state.ConfigReducer)
    const distributionEntity = useSelector(state => state.DistributionReducer)

    //Get current active item index.
    let activeEnitiyIndex = distributionEntity.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }


    const addDataRow = () => {

    }

    const readData = () => {
        CSVFileReader(config.ACTION_READ_DISTRIBUTION_FILE, config.CSVHandlerPath)
        .then(response => { dispatch(editDistributionItem({ 
            ...distributionEntity[activeEnitiyIndex], 
            points: response.data.map((point, index) => { return {"id": index, "value": point }})
        })) })

    }

    return (
        <div className='tab'>
            <IconOpenFile className="control__icon" onClick={readData}/>
            <IconSaveFile className="control__icon control__icon--disabled"/>            
            <div className="regression__data">        
                <DataHeader/>
                {distributionEntity[activeEnitiyIndex].points.map(point => {
                    return <DataRow key={point.id} id={point.id} value={point.value}/>
                })}
                <IconAdd className="control__icon" onClick={addDataRow}/>    
            </div>
        </div>
    )
}

export default DistrabutionScreen

