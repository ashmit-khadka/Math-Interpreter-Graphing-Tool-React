import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import Graph from '../Graph';
import GraphB from '../GraphB';
import GraphC from '../GraphC';
import Selector from '../Selector'
import EmptyEntity from '../EmptyEntity'

import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../../assets/icons/saving-disc.svg'
import { ReactComponent as IconLink} from '../../assets/icons/foreign.svg'
import { ReactComponent as IconCopy} from '../../assets/icons/copy.svg'
import { ReactComponent as IconClear} from '../../assets/icons/reload.svg'
import {CopyToClipboard} from 'react-copy-to-clipboard';


import {execShellCommand} from '../../scripts/threader'
import { CSVFileReader, CSVFileWritter } from '../../scripts/fileReader'
import {randomRGBA, copyToClipboard, round, getActiveEnitiyIndex, templateLineEntity} from '../../scripts/tools'

import Tab from '../Tab'
import Grid from '../Grid'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'
import { addNotification } from '../../redux/actions/NotificationActions';

//CSV handler
//import { threadCMD } from '../../scripts/threader'

const RegressionScreen = () => {    

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 
    const dispatch = useDispatch()

    const config = useSelector(state => state.ConfigReducer) 
    const [isCalculating, SetIsCalculating] = useState(false)

    const graphConfig = useSelector(state => state.GraphReducer)
    const [graphRegion, setGraphRegion] = useState({
        'domain': graphConfig.domain,
        'range': graphConfig.range,
    })
    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(regressionEntities)

    useEffect(()=>{
        if (regressionEntities.length>0) {SetIsCalculating(false)}
        else {SetIsCalculating(true)}    
    },[regressionEntities])


    const addRegressionEnitiy = () => {
        return addEntity({            
            'id': 1,
            'type':'regression',
            'title': 'Example Reg Data 1',
            'colour': randomRGBA(),
            'data': [],
            'analysis': {
            },
            'elements': {
                'lines': [],
                'dots': [],
                'areas': [],
            },
            'active':true,
            'visible':true,
            'analysed':false
        })
    }

    const analyse = () => {       

        console.log(JSON.stringify(regressionEntities[activeEnitiyIndex].data))
        const dataFormatted = regressionEntities[activeEnitiyIndex].data.map( point => [point.x, point.y])
        console.log(JSON.stringify(dataFormatted))
        
        
        execShellCommand(
            config.MathsHandler.path,
            [
                config.MathsHandler.commands.linear_regression_profile,
                JSON.stringify({"data":dataFormatted})      
            ]
        ).then(response => {
            console.log(response)
            if (response.status && response.status == "good") {
                const Syx = response.data.Syx
                const data = [
                    [
                        {x:-10000, y:(response.data.b * -10000 + response.data.a)},
                        {x:10000, y:(response.data.b * 10000 + response.data.a)},
                    ],
                    [
                        {x:-10000, y:(response.data.b * -10000 + response.data.a) + (2.16 * Syx) },
                        {x:10000, y:(response.data.b * 10000 + response.data.a) + (2.16 * Syx) },
                    ],
                    [
                        {x:-10000, y:(response.data.b * -10000 + response.data.a) - (2.16 * Syx) },
                        {x:10000, y:(response.data.b * 10000 + response.data.a) - (2.16 * Syx) },
                    ],
                ]
                regressionEntities[activeEnitiyIndex].analysis = response.data
                regressionEntities[activeEnitiyIndex].elements.lines = data
                regressionEntities[activeEnitiyIndex].analysed = true
                dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))
                onRecalculate([-10000,10000],[])
                //updateGraphRegion()
            }
        })
        
        /*
        execShellCommand(
            config.InterpeterPath
            , [
                JSON.stringify(regressionEntities[activeEnitiyIndex].data)      
        ]).then(response => {
            const data = [
                    {x:-10000, y:(response.a * -10000 + response.b)},
                    {x:10000, y:(response.a * 10000 + response.b)},
                ]
            regressionEntities[activeEnitiyIndex].analysis = response
            regressionEntities[activeEnitiyIndex].elements.lines = data
            regressionEntities[activeEnitiyIndex].analysed = true
            dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))
        })

        */

    }

    const updateGraphRegion = () => {
        let dataArrayX = []
        let dataArrayY = []
        regressionEntities.forEach(entity => {
            if (entity.visible && entity.data.length) {
                entity.data.forEach(point => dataArrayX.push(point.x))
                entity.data.forEach(point => dataArrayY.push(point.y))
            }
        })
        const currentMaxX = Math.max(...dataArrayX)
        const currentMaxY = Math.max(...dataArrayY)
        const currentMinX = Math.min(...dataArrayX)  
        const currentMinY = Math.min(...dataArrayY)  
        //setGraphRegion

        const newRegion = {
            'domain': [currentMinX - (currentMaxX - currentMinX), currentMaxX + (currentMaxX - currentMinX)],
            'range': [currentMinY * .5,currentMaxY * 1.5],
        }
        console.log(currentMinX, currentMaxX, newRegion)

        setGraphRegion(newRegion)
    }



    const onRecalculate = (rangeUpper, rangeLower) => {
        //console.log('new range upper..', rangeUpper,'new range lowers..', rangeLower)
        if (regressionEntities[activeEnitiyIndex]) {
            regressionEntities.forEach(regressionEntity => {
                if(regressionEntity.analysed) {
                    const a = regressionEntity.analysis.a
                    const b = regressionEntity.analysis.b
                    const Syx = regressionEntity.analysis.Syx
                    const data = [
                    
                        [
                            {x:rangeUpper[0], y:(b * rangeUpper[0] + a)},
                            {x:rangeUpper[1], y:(b * rangeUpper[1] + a)},
                        ],
                        [
                            {x:rangeUpper[0], y:(b * rangeUpper[0] + a) + (2.16 * Syx) },
                            {x:rangeUpper[1], y:(b * rangeUpper[1] + a) + (2.16 * Syx) },
                        ],
                        [
                            {x:rangeUpper[0], y:(b * rangeUpper[0] + a) - (2.16 * Syx) },
                            {x:rangeUpper[1], y:(b * rangeUpper[1] + a) - (2.16 * Syx) },
                        ]
                    ]
                    regressionEntity.elements.lines = data
                    dispatch(updateEntity(regressionEntity))
                }
            })

        }
        //linegenerator(rangeUpper[0], rangeUpper[1])
    }



    return (
        <div className="screen">
            {
                regressionEntities.length ? 
                <div className="screen__panel">
                    <Selector 
                        reducer={regressionEntities}
                        actionSelect={selectEntity}
                        actionEdit={updateEntity}
                        actionRemove={removeEntity}
                        actionAdd={addRegressionEnitiy}                
                    />
                    <Tab 
                        tabs={[
                            {
                                'name':'Analysis',
                                'component': <AnalysisTab/>,
                            },
                            {
                                'name':'Data',
                                'component': <DataTab/>,
                            },

                        ]}
                    />
                    
                    <button
                        className={
                            'screen__analyse-btn screen__analyse-btn--active'
                        } 
                        onClick={analyse}
                    >Analyse</button>  
                </div>
                :
                <EmptyEntity
                    reducer={regressionEntities}
                    actionAdd={addRegressionEnitiy}             
                />
            }
            
            <div className="screen__graph">
                <GraphB
                    items = {regressionEntities}  
                    onRecalculate={onRecalculate}
                    isCalculating={isCalculating}
                    activeDomainX={graphRegion.domain} 
                    activeDomainY={graphRegion.range}
                />
            </div>
        </div>
    )
}
//regressionEntities[activeEnitiyIndex].analysed ?'screen__analyse-btn screen__analyse-btn--disabled' :

const AnalysisTab = () => {

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 
    const dispatch = useDispatch()
    const config = useSelector(state => state.ConfigReducer)

    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(regressionEntities)



    let equation = null
    if (regressionEntities[activeEnitiyIndex].analysis.a && regressionEntities[activeEnitiyIndex].analysis.b) {
        equation = `${round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.b)}x+${round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.a)}`
    }

    const createLineEntity = () => {
        console.log(regressionEntities[activeEnitiyIndex].analysed)
        if (regressionEntities[activeEnitiyIndex].analysed == true) {
            console.log('hello??')
            let newLine = templateLineEntity()
            newLine.analysis.expression = `${round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.b)}x+${round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.a)}`
            dispatch(addEntity(newLine))
            dispatch(addNotification({"text":"Created new line item"}))
        }
        else { 
            dispatch(addNotification({"text":"Please analyse data first"})) 
        }
    }

    const getCI = () => {
        let data = []
        for (let i = 0; i<60; i++) {
            data.push(
                (i*0.6)+13.67
            )
        }

        let lineUpper = data.map(pointY => {
            return {x:pointY + 2.16 * 0.8165, y:pointY}
        })
        let lineLower = data.map(pointY => {
            return {x:pointY - 2.16 * 0.8165, y:pointY}
        })

        regressionEntities[activeEnitiyIndex].elements.lines = [lineUpper, lineLower]
        dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))


        console.log(lineLower, lineUpper)
    }

    const onCopy = () => {
        dispatch(addNotification({"text":"Copied","loader":false}))
    }

    return (
        <div className="screen__panel-content">
            <div className="info-item">
                <label>Regression Line f(x):</label>    
                <CopyToClipboard text={equation || "-"}> 
                    <label className="label--text" onClick={onCopy}>{equation || "-"}<IconCopy/></label>
                </CopyToClipboard>
            </div>

            <div className="center">
                <IconLink className="icon-button" onClick={createLineEntity}/>
            </div>
            <div className="info-item">
                <label className="label--item">Corelation Coefficient (r):</label> 
                <CopyToClipboard text={regressionEntities[activeEnitiyIndex].analysis.r || "-"}> 
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.r) || "-"}<IconCopy/></label>
                </CopyToClipboard>

            </div>
            <div className="info-item">
                <label className="label--item">R square (rr):</label>  
                <CopyToClipboard text={regressionEntities[activeEnitiyIndex].analysis.rr || "-"}>    
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.rr) || "-"}<IconCopy/></label>
                </CopyToClipboard>
            </div>
            <div className="info-item">
                <label className="label--item">Slope (b):</label>   
                <CopyToClipboard text={
                    regressionEntities[activeEnitiyIndex].analysis.b && regressionEntities[activeEnitiyIndex].analysis.Sb ?
                    regressionEntities[activeEnitiyIndex].analysis.b + " ± " + regressionEntities[activeEnitiyIndex].analysis.Sb : "-"
                }>  
                    <label className="label--text" onClick={onCopy}>{
                        regressionEntities[activeEnitiyIndex].analysis.b && regressionEntities[activeEnitiyIndex].analysis.Sb ?
                        round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.b) + " ± " + round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.Sb) : "-"
                    }<IconCopy/></label>
                </CopyToClipboard>
            </div>
            <div className="info-item">
                <label className="label--item">Y Intercept (a):</label> 
                <CopyToClipboard text={
                    regressionEntities[activeEnitiyIndex].analysis.a && regressionEntities[activeEnitiyIndex].analysis.Sa ?
                    regressionEntities[activeEnitiyIndex].analysis.a + " ± " + regressionEntities[activeEnitiyIndex].analysis.Sa : "-"
                }>     
                    <label className="label--text" onClick={onCopy}>{
                        regressionEntities[activeEnitiyIndex].analysis.a && regressionEntities[activeEnitiyIndex].analysis.Sa ?
                        round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.a) + " ± " + round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.Sa) : "-"
                    }<IconCopy/></label>
                </CopyToClipboard>
            </div>
            <div className="info-item">
                <label className="label--item">X Intercept:</label>  
                <CopyToClipboard text={regressionEntities[activeEnitiyIndex].analysis.xIntercept || "-"}>   
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.xIntercept) || "-"}<IconCopy/></label>
                </CopyToClipboard>
            </div>
            <div className="info-item">
                <label className="label--item">x-bar (x̅):</label>    
                <CopyToClipboard text={
                    regressionEntities[activeEnitiyIndex].analysis.xMean && regressionEntities[activeEnitiyIndex].analysis.xMeanSE ?
                    regressionEntities[activeEnitiyIndex].analysis.xMean + " ± " + regressionEntities[activeEnitiyIndex].analysis.xMeanSE : "-"
                    
                }>    
                    <label className="label--text" onClick={onCopy}>{
                        regressionEntities[activeEnitiyIndex].analysis.xMean && regressionEntities[activeEnitiyIndex].analysis.xMeanSE ?
                        round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.xMean) + " ± " + round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.xMeanSE) : "-"
                    }<IconCopy/></label>
                </CopyToClipboard>
            </div>
            <div className="info-item">
                <label className="label--item">y-bar (y̅):</label>
                <CopyToClipboard text={
                    regressionEntities[activeEnitiyIndex].analysis.yMean && regressionEntities[activeEnitiyIndex].analysis.yMeanSE ?
                    regressionEntities[activeEnitiyIndex].analysis.yMean + " ± " + regressionEntities[activeEnitiyIndex].analysis.yMeanSE : "-"
                }>     
                    <label className="label--text" onClick={onCopy}>{
                        regressionEntities[activeEnitiyIndex].analysis.yMean && regressionEntities[activeEnitiyIndex].analysis.yMeanSE ?
                        round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.yMean) + " ± " + round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.yMeanSE) : "-"
                    }<IconCopy/></label>
                </CopyToClipboard>
            </div>
            <div className="info-item">
                <label className="label--item">Standard Error of Estimate (Syx):</label>    
                <CopyToClipboard text={regressionEntities[activeEnitiyIndex].analysis.Syx || "-"}>    
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, regressionEntities[activeEnitiyIndex].analysis.Syx) || "-"}<IconCopy/></label>
                </CopyToClipboard>
            </div>
        </div>
    )
}


const DataTab = (props) => {

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 

    const config = useSelector(state => state.ConfigReducer)
    const dispatch = useDispatch()

    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(regressionEntities)

    const resetAnalysis = () => {
        regressionEntities[activeEnitiyIndex].analysed = false
        regressionEntities[activeEnitiyIndex].elements.lines = []
        dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))
    }

    const readData = () => {

        CSVFileReader(config.DataHandler.commands.read_regression, config.DataHandler.path)
        .then(response => {   
            if (response.status && response.status == "good") {
                let points = response.data.map(point => {return {"x":point[0],"y":point[1]}})
            
                regressionEntities[activeEnitiyIndex].data = points
                regressionEntities[activeEnitiyIndex].elements.dots = points
                resetAnalysis()
                dispatch(addNotification({"text":"Data imported", "loader":false}))

            }
            else if (response.status && response.status == "bad") {       
                dispatch(addNotification({"text":"Could not import data", "loader":false}))
         
            }
        })
    }

    const addPoint = () => {
        let points =  regressionEntities[activeEnitiyIndex].data
        points.push({"x":0,"y":0})
        regressionEntities[activeEnitiyIndex].data = points
        regressionEntities[activeEnitiyIndex].elements.dots = points
        resetAnalysis()
    }

    const updatePoint = (index, data) => {
        let points =  regressionEntities[activeEnitiyIndex].data
        points[index] = data
        regressionEntities[activeEnitiyIndex].data = points
        regressionEntities[activeEnitiyIndex].elements.dots = points
        dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))
        resetAnalysis()
    }

    const saveData = () => {
        let requestData = regressionEntities[activeEnitiyIndex].data.map(point => {
            return [point.x, point.y]
        })
        console.log(requestData) 
    
        CSVFileWritter(config.DataHandler.commands.write_regression, requestData, config.DataHandler.path)
        .then(response => { 
            if (response.status && response.status == "good") {
                dispatch(addNotification({"text":"Saved data", "loader":false}))
            }
            else if (response.status && response.status == "bad") {      
                dispatch(addNotification({"text":"Couldn't saved data", "loader":false}))          
            }
        })


        
    }

    const clearData = () => {
        regressionEntities[activeEnitiyIndex].data = []
        regressionEntities[activeEnitiyIndex].elements.dots = []
        resetAnalysis()
    }

    const removePoint = (index) => {
        regressionEntities[activeEnitiyIndex].data.splice(index,1)
        resetAnalysis()
    }

    
    return (
        <div className="screen__data">
            <div className="center">
                <div className="screen__controls">
                    <IconOpenFile className="icon-button" onClick={readData}/>
                    <IconClear className="icon-button" onClick={clearData}/>   
                    <IconSaveFile className="icon-button" onClick={saveData}/>  
                </div>     
            </div>
            <div className="regression__data">
                <Grid headers={["X","Y"]} data={regressionEntities[activeEnitiyIndex].data} onChange={updatePoint} onRemove={removePoint}/>
                <IconAdd className="control__icon" onClick={addPoint}/>                
            </div>
        </div>
    )
}

export default RegressionScreen