import React from 'react'
import Tab from '../Tab'
import Selector from '../Selector'
import { ReactComponent as IconEnter} from '../../assets/icons/enter.svg'
import { ReactComponent as IconReload} from '../../assets/icons/reload.svg'
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'
import {execShellCommand} from '../../scripts/threader'
import { addNotification } from '../../redux/actions/NotificationActions'
import {randomRGBA, copyToClipboard, round} from '../../scripts/tools'
import { lab } from 'd3'



const TableRow = (props) => {

    const dataArray = Object.values(props.data)


    return (
        <div>
            <div className="table-row">
                {Object.values(props.data).map((item, index) => {
                    return <label key={index}>{item}</label>
                })}
            </div>
        </div>
    )
}

const Table = ({ headers, data }) => {



    return (
        <div className="table">
            <div className="table-row table-row__header">
                {headers.map((header, index) => {
                    return <label key={index}>{header}</label>
                })}
            </div>

                {data.map((data, index) => {
                    return <TableRow key={index} data={data} columns={headers.length}></TableRow>
                })}

        </div>
    )
}

const InterpreterScreen = () => {

    const InterpreterEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'interpreter') 

    let activeEnitiyIndex = InterpreterEntities.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }


    const addSession = () => {
        return addEntity({
            'id': 8,
            'type':'interpreter',
            'title': 'Example Data 1',
            'colour': randomRGBA(),
            'data': {
                "symbols":[],
                'history':[]
            },
            'analysis': {},
            'elements': {
                'lines': [],
                'dots': [],
                'areas': [],
            },        
            'active':false,
            'visible':true,
        })
    }




    return (
        <div className="interpreter-screen">
            <div className="interpreter-screen__equation">
                <Selector 
                    reducer={InterpreterEntities}
                    actionSelect={selectEntity}
                    actionEdit={updateEntity}
                    actionRemove={removeEntity}
                    actionAdd={addSession}                
                />
                <InterpreterInput/>
            </div>
            <div className="interpreter-screen__log">
                <div>
                    <Table headers={["Variable", "Value"]} data={InterpreterEntities[activeEnitiyIndex].data.symbols}/>
                </div>
                <div>
                    <Table headers={["Type", "Value", "Result"]} data={InterpreterEntities[activeEnitiyIndex].data.history}/>
                </div>
            </div>
        </div>
    )
}

const InterpreterInput = () => {

    const InterpreterEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'interpreter') 
    const config = useSelector(state => state.ConfigReducer) 

    let activeEnitiyIndex = InterpreterEntities.findIndex(item => {
        return item.active === true
    })
    if (activeEnitiyIndex < 0) { activeEnitiyIndex = 0 }

    const dispatch = useDispatch()


    const enterExpression = () => {
 
        const expression = document.getElementById("expression").value
        document.getElementById("expression").value = ""
        console.log(expression, config.InterpeterPath)
        if (expression == "") {
            dispatch(addNotification({'text':`Please enter a valid expression`, 'loader':false}))
        }
        else {
            let expressionList = InterpreterEntities[activeEnitiyIndex].data.history.map(entry => {
                return entry.value
            })
            expressionList.push(expression)
            execShellCommand(
                config.InterpeterPath, ["expression", JSON.stringify(expressionList)      
            ]).then(response => {
                console.log(response)
                if (response.status && response.status == "good")
                {
                    InterpreterEntities[activeEnitiyIndex].data.history.push(
                        {            
                            "type":expression.includes("=") ? "Assignemnt" : "Expression",
                            "value":expression,
                            "result":response.output            
                        }
                    )
                    const symbols = Object.keys(response.variables).map(variable => {
                        return { "variable": variable, "value": response.variables[variable]}
                    })
                    InterpreterEntities[activeEnitiyIndex].data.symbols = symbols
                    dispatch(updateEntity(InterpreterEntities[activeEnitiyIndex]))
                }
                else if (response.status && response.status == "bad") 
                {
                    dispatch(addNotification({'text':`${response.type} - ${response.error} Location: ${response.location}`, 'loader':false}))
                }
            })
    
        }        
    }

    const reset = () => {
        InterpreterEntities[activeEnitiyIndex].data = {'symbols': [], 'history': []}
        dispatch(updateEntity(InterpreterEntities[activeEnitiyIndex]))
        dispatch(addNotification({'text':`Reset data for ${InterpreterEntities[activeEnitiyIndex].title}`, 'loader':false}))

    }

    const output = {
        "expression": InterpreterEntities[activeEnitiyIndex].data.history.length ? InterpreterEntities[activeEnitiyIndex].data.history[InterpreterEntities[activeEnitiyIndex].data.history.length-1].value : "-",
        "value": InterpreterEntities[activeEnitiyIndex].data.history.length ? InterpreterEntities[activeEnitiyIndex].data.history[InterpreterEntities[activeEnitiyIndex].data.history.length-1].result : "-"
    }

    return (
        <div className="interpreter-screen__main">
            <input id="expression" type="text" className='input--text input--full interpreter-screen__input' name='equation' placeholder="Enter expression e.g. 2*(5-3)+6"></input>
            <div className="interpreter-screen__controls">
                <IconEnter className="icon-button" onClick={enterExpression}/>
                <IconReload className="icon-button" onClick={reset}/>
            </div>
            <div className="interpreter-screen__result">                   
                <label>Expression: {output.expression}</label>
                <label>Result:{output.value}</label>
            </div>
            <div className="interpreter-screen__steps">
                <Step count="1." value="5-2=3"></Step>
                <Step count="2." value="2*3=5"></Step>
                <Step count="3." value="6*6=12"></Step>
            </div>

        </div>
    )
}

const Step = ({ count, value }) => {
    return (
        <div className="step">
            <p className="step__counter">{count}</p>
            <p className="step__value">{value}</p>
        </div>
    )
}

export default InterpreterScreen