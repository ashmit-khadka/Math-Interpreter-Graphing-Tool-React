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
import EmptyEntity from '../EmptyEntity'
import { ReactComponent as IconCopy} from '../../assets/icons/copy.svg'
import {CopyToClipboard} from 'react-copy-to-clipboard';

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
    const [rootResult, SetRootResult] = useState("-")
    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(polynomialEntities)


    useEffect(()=>{
        if (polynomialEntities.length>0) {SetIsCalculating(false)}
        else {SetIsCalculating(true)}    
    },[polynomialEntities])

    const addPolynomialEnitiy = () => {
        return addEntity({         
            'id': null,
            'type':'polynomial',
            'title': 'New Line 2',
            'colour': randomRGBA(),
            'data': [],
            'analysis': {
                'analysed': false,
                'expression': "",
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


    const  linegenerator = (lower, upper) => {
        if (polynomialEntities[activeEnitiyIndex].analysis.variables) {
            //SetIsCalculating(true)                   
            nextNotificationId = notifications.length ? notifications[notifications.length-1].id + 1 : 1

            let newExpression = polynomialEntities[activeEnitiyIndex].analysis.expression.replace("^","^^")

            for (let [key, value] of Object.entries(polynomialEntities[activeEnitiyIndex].analysis.variables)) {

                if (key != polynomialEntities[activeEnitiyIndex].analysis.function) {
                    newExpression = newExpression.replace(key,value)
                }
            }
            
            const increment = ((upper-lower) / config.RESOLUTION)
            const args = [polynomialEntities[activeEnitiyIndex].analysis.function, lower, upper, increment, newExpression ]
            const cmd = JSON.stringify(config.InterpeterPath) + " " + JSON.stringify("cal") + " " + JSON.stringify(JSON.stringify(args))
            console.log(cmd)
            var result = window.require('child_process').execSync(cmd).toString();
            const response = JSON.parse(result)             
            if (response.status && response.status === "good") {
                let points = []
                for (const [key, value] of Object.entries(response.points)) {
                    points.push({'x':key,'y':value})
                }
                //console.log('new points..',points)
                polynomialEntities[activeEnitiyIndex].elements.lines = [points]
                dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))
            }            
        }
    }

    const onRecalculate = (rangeUpper, rangeLower) => {
        //console.log('new range upper..', rangeUpper,'new range lower..', rangeLower)
        if (polynomialEntities && polynomialEntities[activeEnitiyIndex] && polynomialEntities[activeEnitiyIndex].analysis.parsed)
        { linegenerator(rangeUpper[0], rangeUpper[1]) }
        
    }

    let variables = [] 

    const parseExpression = () => {
        const expression = document.getElementById("line-expression").value
        if (expression !== "" )
        {
            execShellCommand(
                config.InterpeterPath, ["parse", JSON.stringify([expression])      
            ]).then(response => {
                console.log(response)
                if (response.status && response.status == "good" && response.variables && Object.keys(response.variables).length > 0) {
                    polynomialEntities[activeEnitiyIndex].analysis.variables = response.variables
                    polynomialEntities[activeEnitiyIndex].analysis.function = Object.keys(response.variables)[0]
                    polynomialEntities[activeEnitiyIndex].analysis.expression = expression
                    polynomialEntities[activeEnitiyIndex].analysis.parsed = true
                    dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))
                    dispatch(addNotification({"text":"Parse successful", "loader":false}))
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
            console.log(response)
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

    const changeFunction = (x) => {
        polynomialEntities[activeEnitiyIndex].analysis.function = x
        dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))
    }

    const changeExpression = () => {
        polynomialEntities[activeEnitiyIndex].analysis.parsed = false
        polynomialEntities[activeEnitiyIndex].analysis.variables = null
        polynomialEntities[activeEnitiyIndex].analysis.function = null
        polynomialEntities[activeEnitiyIndex].analysis.expression = null
        polynomialEntities[activeEnitiyIndex].analysis.result = "-"
        polynomialEntities[activeEnitiyIndex].elements.lines = []
        
        dispatch(updateEntity(polynomialEntities[activeEnitiyIndex]))


    }

    const onCopy = () => {
        dispatch(addNotification({"text":"Copied","loader":false}))
    }


    if (polynomialEntities.length && polynomialEntities[activeEnitiyIndex].analysis.variables) {
        variables.push(<label key={0}>Variables:</label>)
        for (let [key, value] of Object.entries(polynomialEntities[activeEnitiyIndex].analysis.variables)) {
            variables.push(
                <div className="line-variable-item" key={key}>
                    <div className="line-variable-item__control">
                        <label>Make function of</label>
                        <input type="radio" value={key} name="fn"  defaultChecked={
                            polynomialEntities[activeEnitiyIndex].analysis.function === key
                        } onClick={() => changeFunction(key)}></input>
                    </div>
                    <div className="line-variable-item__value">
                        <label>{key}=</label> 
                        <input id={"variable-"+key} name={key} type='number' className='input--text' defaultValue={value} onChange={onVariableValueChange}></input>
                    </div>

                </div>
            )
        }
    }

    const findroot = () => {
        const root1 = document.getElementById("root1").value
        const root2 = document.getElementById("root2").value
        const root3 = document.getElementById("root3").value
        const root4 = document.getElementById("root4").value
        
        console.log(rootResult)
        try {
            if (root1 !== undefined && root1 !== "" && root2 !== undefined && root2 !== "" && root3 !== undefined && root3 !== "" && root4 !== undefined && root4 !== "") {}
            {
                const args = [root1, root2, root3, root4] 
                const cmd = JSON.stringify(config.InterpeterPath) + " " + JSON.stringify("rootofpoly") + " " + JSON.stringify(JSON.stringify(args))
                console.log(cmd)
                var result = window.require('child_process').execSync(cmd).toString();
                const response = JSON.parse(result)
                if (response.status && response.status == "good") {
                    console.log(response)
                    if (response.output == null)
                    { SetRootResult("None") }
                    else { SetRootResult(response.output) }

                }
                else if (response.status && response.status == "bad") {
                    console.log(response)
                }
            }
        }
        catch(err) {
        
        }
          
    }

    return (
        <div className="page screen">
            {
                polynomialEntities.length ?
                <div className="screen__panel">
                    <Selector 
                        reducer={polynomialEntities}
                        actionSelect={selectEntity}
                        actionEdit={updateEntity}
                        actionRemove={removeEntity}
                        actionAdd={addPolynomialEnitiy}                
                    />   
                    <div className="screen__panel-content">

                        <div className="info-item">

                            <label className="label--item">
                                {
                                    polynomialEntities[activeEnitiyIndex].analysis.function !== null ? 
                                    `Expression f(${polynomialEntities[activeEnitiyIndex].analysis.function}):` : 
                                    "Expression f(?):"
                                }
                            </label>    
                            <input id="line-expression" type="text" className='input--text mb--10' name='equation' placeholder="Enter polynomial.." onChange={changeExpression}
                                defaultValue={polynomialEntities[activeEnitiyIndex].analysis.expression}>                
                            </input>

                        </div>

                        
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
                                "screen__section" : "screen_section"
                            }
                        >
                            <hr className="divider"></hr>
                            
                
                            <div className="info-item">
                                <label className="label--item">Result</label>  
                                <CopyToClipboard text={                                
                                        polynomialEntities[activeEnitiyIndex].analysed && polynomialEntities[activeEnitiyIndex].analysis.result ?
                                        polynomialEntities[activeEnitiyIndex].analysis.result : "-"                                
                                }> 
  
                                    <label className='label--text' type="text" onClick={onCopy}> 
                                        {
                                            polynomialEntities[activeEnitiyIndex].analysed && polynomialEntities[activeEnitiyIndex].analysis.result ?
                                            polynomialEntities[activeEnitiyIndex].analysis.result : "-"
                                        }   
                                        <IconCopy/>                            
                                    </label>
                                </CopyToClipboard>

                            </div>

                
                        </div>

                    </div>

                    <button 
                        className={
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
                :
                <EmptyEntity
                    reducer={polynomialEntities}
                    actionAdd={addPolynomialEnitiy}             
                />
            }
            <div className="screen__graph">
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