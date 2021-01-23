import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import Graph from '../Graph';
import GraphB from '../GraphB';
import GraphC from '../GraphC';
import Selector from '../Selector'

import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../../assets/icons/saving-disc.svg'
import { ReactComponent as IconLink} from '../../assets/icons/foreign.svg'
import { ReactComponent as IconCopy} from '../../assets/icons/copy.svg'


import {execShellCommand} from '../../scripts/threader'
import { CSVFileReader, CSVFileWritter } from '../../scripts/fileReader'
import {randomRGBA, copyToClipboard, round, getActiveEnitiyIndex, templateLineEntity} from '../../scripts/tools'

import Tab from '../Tab'
import Grid from '../Grid'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'

import { Redirect  } from 'react-router-dom';

import { MathComponent } from 'mathjax-react'
import { InlineMath, BlockMath } from 'react-katex';
import { addNotification } from '../../redux/actions/NotificationActions';

//CSV handler
//import { threadCMD } from '../../scripts/threader'

const RegressionScreen = () => {    

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 
    const dispatch = useDispatch()

    const config = useSelector(state => state.ConfigReducer) 

    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(regressionEntities)

    const addRegressionEnitiy = () => {
        return addEntity({            
            'id': null,
            'type':'regression',
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
                const data = [
                    [
                        {x:-10000, y:(response.data.b * -10000 + response.data.a)},
                        {x:10000, y:(response.data.b * 10000 + response.data.a)},
                    ],
                    [
                        {x:-10000, y:(response.data.b * -10000 + response.data.a) + (2.16 * 0.8165) },
                        {x:10000, y:(response.data.b * 10000 + response.data.a) + (2.16 * 0.8165) },
                    ],
                    [
                        {x:-10000, y:(response.data.b * -10000 + response.data.a) - (2.16 * 0.8165) },
                        {x:10000, y:(response.data.b * 10000 + response.data.a) - (2.16 * 0.8165) },
                    ],
                ]
                regressionEntities[activeEnitiyIndex].analysis = response.data
                regressionEntities[activeEnitiyIndex].elements.lines = data
                regressionEntities[activeEnitiyIndex].analysed = true
                dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))
    
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


    const onRecalculate = (rangeUpper, rangeLower) => {
        //console.log('new range upper..', rangeUpper,'new range lowers..', rangeLower)
        if (regressionEntities[activeEnitiyIndex].analysed) {
            const a = regressionEntities[activeEnitiyIndex].analysis.a
            const b = regressionEntities[activeEnitiyIndex].analysis.b
            const data = [
             
                [
                    {x:rangeUpper[0], y:(b * rangeUpper[0] + a)},
                    {x:rangeUpper[1], y:(b * rangeUpper[1] + a)},
                ],
                [
                    {x:rangeUpper[0], y:(b * rangeUpper[0] + a) + (2.16 * 0.8165) },
                    {x:rangeUpper[1], y:(b * rangeUpper[1] + a) + (2.16 * 0.8165) },
                ],
                [
                    {x:rangeUpper[0], y:(b * rangeUpper[0] + a) - (2.16 * 0.8165) },
                    {x:rangeUpper[1], y:(b * rangeUpper[1] + a) - (2.16 * 0.8165) },
                ]
            ]
    
            console.log(rangeUpper)
            regressionEntities[activeEnitiyIndex].elements.lines = data
            dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))
        }


        //linegenerator(rangeUpper[0], rangeUpper[1])
    }

    /*
    const example = String.raw`\int_{-\infty}^{\infty}e^{-x^2}\ dx`;
    <MathComponent className='testtt' tex={example} display={true} />
 
    <BlockMath
        math={'\\int_0^\\infty x^2 dx \\inta'}
        errorColor={'#cc0000'}
    />
    */
    return (
        <div className="page screen">
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
                    className={regressionEntities[activeEnitiyIndex].analysed ?
                        'screen__analyse-btn screen__analyse-btn--disabled' :
                        'screen__analyse-btn screen__analyse-btn--active'
                    } 
                    onClick={analyse}
                >Analyse</button>  
            </div>
            <div className="graph-screen__graph">
                <GraphB
                    items = {regressionEntities}  
                    onRecalculate={onRecalculate}
                    isCalculating={false}  
                />
            </div>
        </div>
    )
}


const AnalysisTab = () => {

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 
    const dispatch = useDispatch()

    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(regressionEntities)



    let equation = null
    if (regressionEntities[activeEnitiyIndex].analysis.a && regressionEntities[activeEnitiyIndex].analysis.b) {
        equation = `${round(regressionEntities[activeEnitiyIndex].analysis.a)}x+${round(regressionEntities[activeEnitiyIndex].analysis.b)}`
    }

    const createLineEntity = () => {
        let newLine = templateLineEntity()
        newLine.analysis.expression = `${round(regressionEntities[activeEnitiyIndex].analysis.a)}x+${round(regressionEntities[activeEnitiyIndex].analysis.b)}`
        dispatch(addEntity(newLine))
        dispatch(addNotification({"text":"Create new line item"}))
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

    return (
        <div className="screen__panel-content">
            <button onClick={getCI}>testss</button>
            <div className="info-item">
                <label>Regression Line f(x):</label>    
                <label className="label--text">{equation || "-"}</label>
            </div>

            <div className="center">
                <NavLink to='/line'><IconLink className="icon-button" onClick={createLineEntity}/></NavLink>
            </div>
            <div className="info-item">
                <label className="label--item">Corelation Coefficient (r)</label>    
                <label className="label--text">{round(regressionEntities[activeEnitiyIndex].analysis.r) || "-"}<IconCopy/></label>
            </div>
            <div className="info-item">
                <label className="label--item">R square (rr)</label>    
                <label className="label--text">{round(regressionEntities[activeEnitiyIndex].analysis.rr) || "-"}<IconCopy/></label>
            </div>
            <div className="info-item">
                <label className="label--item">Slope (b)</label>    
                <label className="label--text">{round(regressionEntities[activeEnitiyIndex].analysis.b) + ' ± 1.43' || "-"}<IconCopy/></label>
            </div>
            <div className="info-item">
                <label className="label--item">Y Intercept (a)</label>    
                <label className="label--text">{round(regressionEntities[activeEnitiyIndex].analysis.a) || "-"}<IconCopy/></label>
            </div>
            <div className="info-item">
                <label className="label--item">X Intercept</label>    
                <label className="label--text">{"-"}<IconCopy/></label>
            </div>
            <div className="info-item">
                <label className="label--item">x-bar (x̅)</label>    
                <label className="label--text">{round(regressionEntities[activeEnitiyIndex].analysis.xMean) || "-"}<IconCopy/></label>
            </div>
            <div className="info-item">
                <label className="label--item">y-bar (y̅)</label>    
                <label className="label--text">{round(regressionEntities[activeEnitiyIndex].analysis.yMean) || "-"}<IconCopy/></label>
            </div>
            <div className="info-item">
                <label className="label--item">Standard Error of Estimate (Syx)</label>    
                <label className="label--text">{round(regressionEntities[activeEnitiyIndex].analysis.Syx) || "-"}<IconCopy/></label>
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

    const readFile = () => {
        CSVFileReader(config.ACTION_READ_REGRESSION_FILE, config.CSVHandlerPath)
        .then(response => {   
            let points = []
            response.data.forEach(point => { points.push(point) }) 
            regressionEntities[activeEnitiyIndex].data = points
            regressionEntities[activeEnitiyIndex].elements.dots = points
            resetAnalysis()
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
        resetAnalysis()
    }

    const saveData = () => {
        CSVFileWritter(config.ACTION_WRITE_REGRESSION_FILE, regressionEntities[activeEnitiyIndex].data, config.CSVHandlerPath)
        .then(response => { 
            console.log(response)
        })
    }

    const removePoint = (index) => {

        console.log('to remove..', index, regressionEntities[activeEnitiyIndex].data)
        let points = []
         //points = points.splice(1, 1)
        regressionEntities[activeEnitiyIndex].data
        .forEach((item, itemIndex) => {
            if (itemIndex != index) {
                console.log('keep..', item)
                points.push(item)
            }
        })

        console.log('new points..', points)
        regressionEntities[activeEnitiyIndex].data = points
        regressionEntities[activeEnitiyIndex].elements.dots = points
        regressionEntities[activeEnitiyIndex].analysed = false
        regressionEntities[activeEnitiyIndex].elements.dots = []
        dispatch(updateEntity(regressionEntities[activeEnitiyIndex]))
    }

    
    return (
        <div className="screen__data">
            <div className="center">
                <IconOpenFile className="icon-button" onClick={readFile}/>
                <IconSaveFile className="icon-button" onClick={saveData}/>       
            </div>
            <div className="regression__data">
                <Grid headers={["X","Y"]} data={regressionEntities[activeEnitiyIndex].data} onChange={updatePoint} onRemove={removePoint}/>
                <IconAdd className="control__icon" onClick={addPoint}/>                
            </div>
        </div>
    )
}

export default RegressionScreen