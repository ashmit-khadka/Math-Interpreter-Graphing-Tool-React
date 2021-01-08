import React, { useState, useEffect } from 'react';
import GraphB from '../GraphB';
import Tab from '../Tab';
import Grid from '../Grid';
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../../assets/icons/saving-disc.svg'
import {execShellCommand} from '../../scripts/threader'
import CSVFileReader from '../../scripts/fileReader'
import randomRGBA from '../../scripts/tools'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'



let PointID = 0 
let sample = [165,177,188,178,182,172,186,168,174,183,181,193] 

const DistrabutionScreen = () => {

    const distributionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'distribution') 
    const dispatch = useDispatch()

    let activeEnitiyIndex = distributionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }

    //dummy values for debugging
    useEffect(() => {

            const points = sample.map(element => {
                return {
                    'x':element,
                }
            })
        
            console.log(points)
            dispatch(updateEntity({ ...distributionEntities[activeEnitiyIndex], 
                data: points
            })) 
    }, [])

    const addDistributionEnitiy = () => {
        return addEntity({            
            'id': null,
            'type':'distribution',
            'title': null,
            'colour': randomRGBA(),
            'data': [],
            'analysis': {},
            'elements': {
                'lines': [],
                'dots': [],
                'areas': [],
            },        'active':false,
            'visible':true,        
        })
    }

    const analyse = () => {
        //console.log(JSON.stringify(distributionEntities[activeEnitiyIndex].data.map(point => point.x)))
        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore - Dist\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe",
            ["st_Norm", JSON.stringify(distributionEntities[activeEnitiyIndex].data.map(point => point.x))] 
        )
        .then(response => {
            //console.log('values..', response.density)
            
            dispatch(updateEntity({...distributionEntities[activeEnitiyIndex], 
                elements:{
                    ...distributionEntities[activeEnitiyIndex].elements, lines:response.density
                },
                analysis: {
                    'mean': response.mean,
                    'variance': response.variance   
                }
            }))

            //test()
        })
    }


    return (
        <div className="page screen">
            <div className="screen__panel">
                <Tab 
                    tabs={[
                        {
                            'name':'Analysis',
                            'component': <AnalysisTab />,
                        },
                        {
                            'name':'Data',
                            'component': <DataTab/>,
                        },
                    ]}
                    redux={{
                        'reducer': distributionEntities,
                        'action_select': selectEntity,
                        'action_edit': updateEntity,
                        'action_remove': removeEntity,
                        'action_add': addDistributionEnitiy,
                    }}
                />
                <button className='screen__analyse' onClick={analyse}>Analyse</button>  
            </div>
            <div className="graph-screen__graph">
                <GraphB items={distributionEntities}/>
            </div>
        </div>
    )
}

const AnalysisTab = ({setLines, setAreas, areaObjects, currentEntityId }) => {

    let lineYVals = []
    const distributionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'distribution') 
    const dispatch = useDispatch()

    //Get current active item index.
    let activeEnitiyIndex = distributionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }


    const [analysis, setAnalysis] = useState({
        'mean': 0,
        'variance': 0,
        'probability': 0
    })


    //Create an area where 150<x<170
    const getProbabilityAreaDomain = (xLower, xUpper) => {
        //console.log('creating area..')
        const interval = (xUpper - xLower) / 10
        let domain = []
        for (let i = xLower; i <= xUpper; i += interval) { domain.push(i) }
        
        
        return domain
        
        //const args = {'mean': distributionEntities[activeEnitiyIndex].analysis.mean, 'variance': distributionEntities[activeEnitiyIndex].analysis.variance, 'domain': domain}
        //console.log(JSON.stringify(args))
        
        /*
        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore - Dist\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe",
            ['st_Norm_curve', args] 
        )
        .then(response => {
            //setAreas(...areaObjects, [response.density])


            console.log("area..", response.density)

            let areas = distributionEntities[activeEnitiyIndex].elements.areas
            areas.push(response.density)
            dispatch(updateEntity({...distributionEntities[activeEnitiyIndex], 
                elements:{
                    ...distributionEntities[activeEnitiyIndex].elements, areas:areas
                }
            }))
        })   
        */       
    }

    const getProbability = () => {
        //console.log(JSON.stringify(regressionPoints))
        const selectedType = document.getElementById("probabilityType").value
        const xVar1 = document.getElementById("xVal1").value 
        const xVar2 = document.getElementById("xVal2").value 


        const args = {
            "mean":distributionEntities[activeEnitiyIndex].analysis.mean,
            "variance":distributionEntities[activeEnitiyIndex].analysis.variance,
            "areas":[],
            "probability":{
                "type":JSON.stringify(selectedType),
                "boundries":[]
            }
        }

        /*
        let requestData = {}
        dispatch(updateEntity({...distributionEntities[activeEnitiyIndex], 
            elements:{
                ...distributionEntities[activeEnitiyIndex].elements, areas:['ghfghfghgfhfsgh']
            }
        }))
        */

        switch (selectedType) {
            case 'st_CP_GT':
                args.areas.push(getProbabilityAreaDomain( parseFloat(xVar1), parseFloat(200)))
                args.probability.boundries.push(xVar1)
                break;
            case 'st_CP_LET':
                args.areas.push(getProbabilityAreaDomain( parseFloat(0), parseFloat(xVar1)))
                args.probability.boundries.push(xVar1)

                break;
            case 'st_CP_BTW':
                args.areas.push(getProbabilityAreaDomain( parseFloat(xVar1), parseFloat(xVar2)))
                args.probability.boundries.push(xVar1)
                args.probability.boundries.push(xVar2) 
                break;
            case 'st_CP_OUT':
                args.areas.push(getProbabilityAreaDomain( parseFloat(0), parseFloat(xVar1)))
                args.areas.push(getProbabilityAreaDomain( parseFloat(xVar2), parseFloat(200)))
                args.probability.boundries.push(xVar1)
                args.probability.boundries.push(xVar2)

                break;
        }

        console.log('getting resultdds for..', selectedType,)
        
        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore - Dist\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe",
            ["st_probability", args] 
        ). then(response => {
            console.log(response)
            dispatch(updateEntity({...distributionEntities[activeEnitiyIndex], 
                elements:{
                    ...distributionEntities[activeEnitiyIndex].elements, areas:response.areas
                }
            }))
        })  
    
        //console.log(JSON.stringify(args).replace(/"\\"/g, "'").replace(/\\""/g, "'"))
    }
    //console.log('areas..', areaObjects)
  
    return (
        <div className='screen__panel-content'>
            <label>Mean (μ):</label>    
            <label className="label-text">{distributionEntities[activeEnitiyIndex].analysis.mean || "-"}</label>

            <label>Variance (σ):</label>    
            <label className="label-text">{distributionEntities[activeEnitiyIndex].analysis.variance || "-"}</label>


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
    const distributionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'distribution') 


    
    //Get current active item index.
    let activeEnitiyIndex = distributionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }

    const readData = () => {
        CSVFileReader(config.ACTION_READ_DISTRIBUTION_FILE, config.CSVHandlerPath)
        .then(response => { 
            let points = []
            response.data.forEach(point => { points.push(point) }) 
            console.log(points)
            dispatch(updateEntity({ ...distributionEntities[activeEnitiyIndex], 
                data: points
            })) 
        })
    }

    const addPoint = () => {
        let points =  distributionEntities[activeEnitiyIndex].data
        points.push({"x":0})
        dispatch(updateEntity({...distributionEntities[activeEnitiyIndex], data: points
        }))
    }

    const updatePoint = (index, data) => {
        let points =  distributionEntities[activeEnitiyIndex].data
        points[index] = data
        dispatch(updateEntity({...distributionEntities[activeEnitiyIndex], data: points
        }))
    }

    const removePoint = (index) => {

        console.log('to remove..', index, distributionEntities[activeEnitiyIndex].data)
        let points = []
         //points = points.splice(1, 1)
         distributionEntities[activeEnitiyIndex].data
        .forEach((item, itemIndex) => {
            if (itemIndex != index) {
                console.log('keep..', item)
                points.push(item)
            }
        })

        console.log('new points..', points)
 
        dispatch(updateEntity({...distributionEntities[activeEnitiyIndex], data: points
        }))
    }

    return (
        <div className="screen__data">
            <div>
                <IconOpenFile className="control__icon" onClick={readData}/>
                <IconSaveFile className="control__icon control__icon--disabled"/>       
            </div>
            <Grid headers={["X"]} data={distributionEntities[activeEnitiyIndex].data} onChange={updatePoint} onRemove={removePoint}/>
            <IconAdd className="control__icon" onClick={addPoint}/>    
        </div>
    )
}

export default DistrabutionScreen

