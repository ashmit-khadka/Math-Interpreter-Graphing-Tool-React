import React, { useState, useEffect } from "react"
//redux
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'
import { addNotification, completeNotification, updateNotification } from '../../redux/actions/NotificationActions'
import {randomRGBA, getActiveEnitiyIndex } from '../../scripts/tools'
import GraphB from '../GraphB';
import Selector from '../Selector'
import {execShellCommand} from '../../scripts/threader'
import { enableGraphReset } from '../../redux/actions/GraphActions'
import { active } from "d3";

//let data = []
let nextNotificationId = 1;
const PolynomialScreen = () => {
    const polynomialEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'polynomial') 
    const notifications = useSelector(state => state.NotificationReducer)
    const [equation, setEquation] = useState()

    const dispatch = useDispatch()
    const config = useSelector(state => state.ConfigReducer) 
    const [data, setData] = useState([{},{}])
    const [notificationId, setNotificationId] = useState()
    const [isCalculating, SetIsCalculating] = useState(false)
    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(polynomialEntities)

    const resolution = 10

    const addPolynomialEnitiy = () => {
        return addEntity({         
            'id': null,
            'type':'polynomial',
            'title': 'New Line 2',
            'colour': randomRGBA(),
            'data': [],
            'analysis': {
                'analysed': false,
                'expression': null,
                'function':null,
                'variables': {}
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


    const linegenerator = (lower, upper) => {
        SetIsCalculating(true)       
        nextNotificationId = notifications.length ? notifications[notifications.length-1].id + 1 : 1
        let expressionList = []
        for (let [key, value] of Object.entries(polynomialEntities[activeEnitiyIndex].analysis.variables)) {
            expressionList.push(`${key}=${document.getElementById("variable-"+key).value}`)
        }
        expressionList.push(polynomialEntities[activeEnitiyIndex].analysis.expression)
        clear() 
        dispatch(addNotification({'text':'Calculating points', 'loader':true}))       
        console.log(expressionList)
        const increment = Math.round((upper-lower) / resolution)
        
        for(let i = lower; i<upper; i+=increment) {

            setTimeout(function() {
                expressionList[0] = "x="+i
                execShellCommand(
                    config.InterpeterPath, ["expression", JSON.stringify(expressionList)      
                ]).then(response => {
                    setData(data => [...data, {"x":i,"y":response.output}])
                })
            }, 50);
  
        }  
        

    }

    const onRecalculate = (rangeUpper, rangeLower) => {
        console.log('new range upper..', rangeUpper,'new range lower..', rangeLower)
        linegenerator(rangeUpper[0], rangeUpper[1])
        //
    }


    useEffect(() => {
        //console.log("set id", nextNotificationId)
        //console.log("true id", notifications[notifications.length-1].id + 1)
        dispatch(updateNotification({'id':nextNotificationId,'text':`Calculating points ${data.length}%`}))
        if (data.length == resolution-1) {
            console.log('complete', notificationId)
            data.pop()
            polynomialEntities[activeEnitiyIndex].elements.lines = data.sort((a, b) => (a.x > b.x) ? 1 : -1)
            dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))
            dispatch(completeNotification(nextNotificationId))
            SetIsCalculating(false)
        }
    }, [data])


    useEffect(()=>{
        console.log("id is..", notificationId)
    },[notificationId])


    const clear = () => {
        setData([])
    }


    let variables = [] 

    const parseExpression = () => {
        const expression = document.getElementById("line-expression").value
        if (expression !== "" )
        {
            execShellCommand(
                config.InterpeterPath, ["parse", JSON.stringify([expression])      
            ]).then(response => {
                console.log(response.variables)
                if (response.status && response.status == "good" && response.variables && Object.keys(response.variables).length > 0) {
                    polynomialEntities[activeEnitiyIndex].analysis.variables = response.variables
                    polynomialEntities[activeEnitiyIndex].analysis.function = Object.keys(response.variables)[0]
                    polynomialEntities[activeEnitiyIndex].analysis.expression = expression
                    polynomialEntities[activeEnitiyIndex].analysis.parsed = true
                    dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))
                    dispatch(addNotification({"text":"Parse successful", "loader":false}))

                    //if (response)
                    //dispatch(enableGraphReset())
                    //linegenerator(-100000, 10000)
                }
                else if (response.status && response.status == "bad") {
                    console.log(response)
                    dispatch(addNotification({"text":`${response.type} - ${response.error}`, "loader":false}))
                }
                else {
                    dispatch(addNotification({"text":"Cannot parse the expression "+expression, "loader":false}))
                }
            })
        }
    }

    const analyseExpression = () => {
        let expressionList = []
        for (const [key, value] of Object.entries(polynomialEntities[activeEnitiyIndex].analysis.variables)) {
            if (value != null) {
                expressionList.push(`${key}=${value}`)
            }
            else {
                dispatch(addNotification({"text":`Please enter value for ${key} and try again.`, "loader":false}))
                return
            }
        }
        expressionList.push(polynomialEntities[activeEnitiyIndex].analysis.expression)
        execShellCommand(
            config.InterpeterPath, ["expression", JSON.stringify(expressionList)      
        ]).then(response => {
            console.log(response.variables)
            if (response.status && response.status == "good") {
                polynomialEntities[activeEnitiyIndex].analysis.result = response.output
                polynomialEntities[activeEnitiyIndex].analysed = true
                dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))
                dispatch(addNotification({"text":"Analysis Complete", "loader":false}))

            }
            else if (response.status && response.status == "bad") {
                console.log(response)
                dispatch(addNotification({"text":`${response.type} - ${response.error}`, "loader":false}))
            }
            else {
                dispatch(addNotification({"text":"Cannot parse the expression", "loader":false}))
            }
        })

    }

    const onVariableValueChange = (e) => {
        console.log(e.target.name)
        polynomialEntities[activeEnitiyIndex].analysis.variables[e.target.name] = e.target.value
        polynomialEntities[activeEnitiyIndex].analysed = false
        dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))
    }


    //determins if the data needs to be analysed.
    const toggleAnalysis = () => {
        if (polynomialEntities[activeEnitiyIndex].analysis.analysed) {
            polynomialEntities[activeEnitiyIndex].analysis.analysed = false
            dispatch(updateEntity(polynomialEntities[activeEnitiyIndex].analysis))
        }
    }

    const plotGraph = () => {
        dispatch(enableGraphReset())
        linegenerator(-10000, 10000)
    }

    if (polynomialEntities[activeEnitiyIndex].analysis.variables) {
        variables.push(<label key={0}>Variables:</label>)
        for (let [key, value] of Object.entries(polynomialEntities[activeEnitiyIndex].analysis.variables)) {
            variables.push(
                <div className="line-variable-item" key={key}>
                    <div className="line-variable-item__control">
                        <label>Make function of</label>
                        <input type="radio" value={key} defaultChecked={
                            polynomialEntities[activeEnitiyIndex].analysis.function === key
                        }></input>
                    </div>
                    <div className="line-variable-item__value">
                        <label>{key}=</label> 
                        <input id={"variable-"+key} name={key} type='number' className='input--text' defaultValue={value} onChange={onVariableValueChange}></input>
                    </div>

                </div>
            )
        }
    }

    return (
        <div className="page screen">
            <div className="screen__panel">
                <Selector 
                    reducer={polynomialEntities}
                    actionSelect={selectEntity}
                    actionEdit={updateEntity}
                    actionRemove={removeEntity}
                    actionAdd={addPolynomialEnitiy}                
                />   
                <div className="screen__panel-content">
                    <label>
                        {
                            polynomialEntities[activeEnitiyIndex].analysis.function !== null ? 
                            `Expression f(${polynomialEntities[activeEnitiyIndex].analysis.function}):` : 
                            "Expression f(?):"
                        }
                    </label>    
                    <input id="line-expression" type="text" className='input--text mb--10' name='equation' placeholder="Enter polynomial.." onChange={toggleAnalysis}
                        defaultValue={polynomialEntities[activeEnitiyIndex].analysis.expression}>                
                    </input>
                    <button 
                        className={
                            polynomialEntities[activeEnitiyIndex].analysis.parsed ?
                            "input--button input--button--active" : "input--button input--disabled"
                        }
                        onClick={plotGraph}
                    >Plot</button>
                    <div 
                        className={
                            polynomialEntities[activeEnitiyIndex].analysis.parsed ?
                            "screen__section" : "screen_section hide"
                        }
                    >
                        <hr className="divider"></hr>
                        <span>{equation}</span>
                        <div>
                            {variables}
                        </div>
                    </div>

                    <div 
                        className={
                            polynomialEntities[activeEnitiyIndex].analysis.parsed ?
                            "screen__section" : "screen_section hide"
                        }
                    >
                        <hr className="divider"></hr>
                        <label>Roots:</label>    
                        <label id="" type="text" className='label--text'>                               
                        </label>
                        <label>Result:</label>    
                        <label id="" type="text" className='label--text'>
                            {
                                polynomialEntities[activeEnitiyIndex].analysed && polynomialEntities[activeEnitiyIndex].analysis.result ?
                                polynomialEntities[activeEnitiyIndex].analysis.result : ""
                            }                               
                        </label>
                    </div>

                </div>

                <button 
                    className={polynomialEntities[activeEnitiyIndex].analysed ?
                        'screen__analyse-btn screen__analyse-btn--disabled' :
                        'screen__analyse-btn screen__analyse-btn--active'
                    }
                    onClick={() => {
                        polynomialEntities[activeEnitiyIndex].analysis.parsed ?
                        analyseExpression() : parseExpression()
                    }}
                >
                    {
                        polynomialEntities[activeEnitiyIndex].analysis.parsed ?
                        "Analyse" : "Check Expression"
                    }
                </button>  
          </div>
            <div className="graph-screen__graph">
                <GraphB
                    items = {polynomialEntities}
                    onRecalculate={onRecalculate}
                    isCalculating={isCalculating}
                    />
            </div>
        </div>
    )
}

export default PolynomialScreen