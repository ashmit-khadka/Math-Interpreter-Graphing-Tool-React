import React, { useState } from "react"
import Tab from '../Tab'
//redux
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'
import { setNotification, addNotification } from '../../redux/actions/NotificationActions'
import randomRGBA from '../../scripts/tools'
import GraphB from '../GraphB';

const PolynomialScreen = () => {
    const polynomialEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'polynomial') 
    const dispatch = useDispatch()

   
    //Get current active item index.
    let activePolynomialEnitiyIndex = polynomialEntities.findIndex(item => {
        return item.active === true
    })
    if (activePolynomialEnitiyIndex < 0) { activePolynomialEnitiyIndex = 0 }

    const analyse = () => {
        /*
        dispatch(updateEntity({...polynomialEntities[activePolynomialEnitiyIndex], 
            analysis:{"variables":{
                "x":5,
                "c":0
            },
            elements:{...polynomialEntities[activePolynomialEnitiyIndex].elements, lines:[
                {"x":-10000, "y":-10000},
                {"x":10000, "y":10000},
            ]}
        }}))
       
        //dispatch(setNotification({'text':'Equation is valid'}))
        
        dispatch(addNotification({'text':'Equation is valid', 'loader':false}))
        */

        const data = [
            {x:-10000, y:-10000},
            {x:10000, y:10000},
        ]

        const analysis = {"variables":{
            "x":5,
            "c":0
        }}

        dispatch(updateEntity(({...polynomialEntities[activePolynomialEnitiyIndex], analysis:analysis, elements: {
            ...polynomialEntities[activePolynomialEnitiyIndex].elements, lines:data
        }})))
        dispatch(addNotification({'text':'Equation is valid', 'loader':false}))
    }

    const addPolynomialEnitiy = () => {
        return addEntity({            
            'id': null,
            'type':'polynomial',
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

    return (
        <div className="page screen">
            <div className="screen__panel">
                <Tab 
                    tabs={[
                        {
                            'name':'Analysis',
                            'component': <AnalysisTab polynomials={polynomialEntities}/>,
                        }
                    ]}
                    redux={{
                        'reducer': polynomialEntities,
                        'action_select': selectEntity,
                        'action_edit': updateEntity,
                        'action_remove': removeEntity ,
                        'action_add': addPolynomialEnitiy,
                    }}
                />                
                <button className='screen__analyse' onClick={analyse}>Analyse</button>  
          </div>
            <div className="graph-screen__graph">
                <GraphB
                    items = {polynomialEntities}
    
                />
            </div>
        </div>
    )
}

const AnalysisTab = () => {
    const polynomialEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'polynomial') 
    //const notification = useSelector(state => state.NotificationReducer)

    const dispatch = useDispatch()
    const [equation, setEquation] = useState()
   
    //Get current active item index.
    let activePolynomialEnitiyIndex = polynomialEntities.findIndex(item => {
        return item.active === true
    })
    if (activePolynomialEnitiyIndex < 0) { activePolynomialEnitiyIndex = 0 }

    //console.log('sdfsdfsd', polynomialEntities[activePolynomialEnitiyIndex].analysis)

    let variables = [] 
    if (polynomialEntities[activePolynomialEnitiyIndex].analysis.variables) {
        variables.push(<label key={0}>Variables:</label>)
        for (let [key, value] of Object.entries(polynomialEntities[activePolynomialEnitiyIndex].analysis.variables)) {
            console.log(key)
            variables.push(
                <div key={key}>
                    <label>{key} = </label>    
                    <input id="" type='number' className='input--text' name='equation' placeholder="" ></input>
                </div>
            )
        }
    }

    const onChangeEquation = (e) => {
        //console.log(e.target.value)
        //setEquation(e.target.value)
    }


    return (
        <div className="screen__panel-content">
            <label>Expression:</label>    
            <input id="" type="text" className='input--text' name='equation' placeholder="Enter polynomial.." onChange={onChangeEquation}></input>
            <span>{equation}</span>
            <div>
                {variables}
                <p className="result-text result-text--disabled">Result: -</p>
            </div>
        </div>
    )
}

export default PolynomialScreen