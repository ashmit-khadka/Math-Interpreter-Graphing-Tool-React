import React, { useState, useEffect } from 'react';
import Graph from '../Graph';
import GraphB from '../GraphB';
import LineItem from '../LineItem'
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../../assets/icons/saving-disc.svg'
import { ReactComponent as IconLink} from '../../assets/icons/foreign.svg'

import {execShellCommand} from '../../scripts/threader'
import CSVFileReader from '../../scripts/fileReader'
import {randomRGBA, copyToClipboard, round} from '../../scripts/tools'

import Tab from '../Tab'
import Grid from '../Grid'

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'


import { MathComponent } from 'mathjax-react'
import { InlineMath, BlockMath } from 'react-katex';

//CSV handler
//import { threadCMD } from '../../scripts/threader'

const RegressionScreen = () => {    

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 
    const dispatch = useDispatch()

   
    //Get current active item index.
    let activeRegressionEnitiyIndex = regressionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeRegressionEnitiyIndex < 0) { activeRegressionEnitiyIndex = 0 }

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
        //console.log(JSON.stringify(regressionPoints))
        
        let data = []

        console.log(JSON.stringify(regressionEntities[activeRegressionEnitiyIndex].data))

        execShellCommand(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe"
            , [
                JSON.stringify(regressionEntities[activeRegressionEnitiyIndex].data)      
        ]).then(response => {
            //console.log('r line', regressionEntities[activeRegressionEnitiyIndex].line)
            const data = [
                    {x:-1000, y:(response.a * -1000 + response.b)},
                    {x:1000, y:(response.a * 1000 + response.b)},
                ]
        
            //console.log(data)
            //setAnalysis({...analysis, a:response.a, b:response.b, r: response.r, xbar:response.xbar, ybar:response.ybar})
            dispatch(updateEntity({...regressionEntities[activeRegressionEnitiyIndex], analysis:response, elements: {
                ...regressionEntities[activeRegressionEnitiyIndex].elements, lines:data
            }}))
        });

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
                    redux={{
                        'reducer': regressionEntities,
                        'action_select': selectEntity,
                        'action_edit': updateEntity,
                        'action_remove': removeEntity ,
                        'action_add': addRegressionEnitiy,
                    }}
                />
                
                <button className='screen__analyse' onClick={analyse}>Analyse</button>  


          </div>
            <div className="graph-screen__graph">
                <GraphB
                    items = {regressionEntities}
    
                />
            </div>
        </div>
    )
}


const AnalysisTab = () => {

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 

    //Get current active item index.
    let activeRegressionEnitiyIndex = regressionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeRegressionEnitiyIndex < 0) { activeRegressionEnitiyIndex = 0 }
    console.log('currently active..')


    let equation = null
    if (regressionEntities[activeRegressionEnitiyIndex].analysis.a && regressionEntities[activeRegressionEnitiyIndex].analysis.b) {
        equation = `${round(regressionEntities[activeRegressionEnitiyIndex].analysis.a)}x+${round(regressionEntities[activeRegressionEnitiyIndex].analysis.b)}`
    }

    return (
        <div className="screen__panel-content">
            <label>Regression Line f(x):</label>    
            <label className="label-text">{equation || "-"}</label>
            <div className="center"><IconLink className="icon-button icon-button--small"/></div>
            
            <label id="regr">Corelation Coefficient (r):</label>    
            <label className="label-text">{round(regressionEntities[activeRegressionEnitiyIndex].analysis.r) || "-"}</label>
            <label>x-bar (x̅):</label>    
            <label className="label-text">{round(regressionEntities[activeRegressionEnitiyIndex].analysis.xbar) || "-"}</label>
            <label>y-bar (y̅):</label>    
            <label className="label-text">{round(regressionEntities[activeRegressionEnitiyIndex].analysis.ybar) || "-"}</label>

        </div>
    )
}


const DataTab = (props) => {

    const regressionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'regression') 

    const config = useSelector(state => state.ConfigReducer)
    const dispatch = useDispatch()

    //Get current active item index.
    let activeRegressionEnitiyIndex = regressionEntities.findIndex(item => {
        return item.active === true
    })
    if (activeRegressionEnitiyIndex < 0) { activeRegressionEnitiyIndex = 0 }



    const readFile = () => {
        CSVFileReader(config.ACTION_READ_REGRESSION_FILE, config.CSVHandlerPath)
        .then(response => {   
            let points = []
            response.data.forEach(point => { points.push(point) }) 
            dispatch(updateEntity({...regressionEntities[activeRegressionEnitiyIndex], data: points, elements:{
                ...regressionEntities[activeRegressionEnitiyIndex].elements, dots:points
            }}))
        })
    }

    const addPoint = () => {
        let points =  regressionEntities[activeRegressionEnitiyIndex].data
        points.push({"x":0,"y":0})
        dispatch(updateEntity({...regressionEntities[activeRegressionEnitiyIndex], data: points, elements:{
            ...regressionEntities[activeRegressionEnitiyIndex].elements, dots:points
        }}))
    }

    const updatePoint = (index, data) => {
        let points =  regressionEntities[activeRegressionEnitiyIndex].data
        points[index] = data
        dispatch(updateEntity({...regressionEntities[activeRegressionEnitiyIndex], data: points, elements:{
            ...regressionEntities[activeRegressionEnitiyIndex].elements, dots:points
        }}))    
    }

    const removePoint = (index) => {

        console.log('to remove..', index, regressionEntities[activeRegressionEnitiyIndex].data)
        let points = []
         //points = points.splice(1, 1)
        regressionEntities[activeRegressionEnitiyIndex].data
        .forEach((item, itemIndex) => {
            if (itemIndex != index) {
                console.log('keep..', item)
                points.push(item)
            }
        })

        console.log('new points..', points)
        dispatch(updateEntity({...regressionEntities[activeRegressionEnitiyIndex], data: points, elements:{
            ...regressionEntities[activeRegressionEnitiyIndex].elements, dots:points
        }}))    
    
    }

    
    return (
        <div className="screen__data">
            <div>
                <IconOpenFile className="control__icon" onClick={readFile}/>
                <IconSaveFile className="control__icon control__icon--disabled"/>       
            </div>
            <div className="regression__data">
                <Grid headers={["X","Y"]} data={regressionEntities[activeRegressionEnitiyIndex].data} onChange={updatePoint} onRemove={removePoint}/>
                <IconAdd className="control__icon" onClick={addPoint}/>                
            </div>
        </div>
    )
}

export default RegressionScreen