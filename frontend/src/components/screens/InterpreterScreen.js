import React from 'react'
import Selector from '../Selector'
import { ReactComponent as IconEnter} from '../../assets/icons/enter.svg'
import { ReactComponent as IconReload} from '../../assets/icons/reload.svg'
import { ReactComponent as IconHistory} from '../../assets/icons/history.svg'
import { ReactComponent as IconList} from '../../assets/icons/list.svg'
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'
import { addNotification } from '../../redux/actions/NotificationActions'
import { randomRGBA, getActiveEnitiyIndex } from '../../scripts/tools'



const TableRow = (props) => {
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
    const activeEnitiyIndex = getActiveEnitiyIndex(InterpreterEntities)
    const dispatch = useDispatch()

    const addSession = () => {
        console.log('adding..')
        return addEntity({
            'id': null,
            'type':'interpreter',
            'title': null,
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
            'analysed':false
        })
    }

    const removeSession = () => {
        if (InterpreterEntities.length === 1) {
            dispatch(addSession())
        }
        const currentId = InterpreterEntities[activeEnitiyIndex].id
        return removeEntity(currentId)
    }

    return (
        <div className="interpreter-screen">
            <div className="interpreter-screen__equation">
                <Selector 
                    reducer={InterpreterEntities}
                    actionSelect={selectEntity}
                    actionEdit={updateEntity}
                    actionRemove={removeSession}
                    actionAdd={addSession}                
                />
                <InterpreterInput/>
            </div>
            <div className="interpreter-screen__log">
                <div className="interpreter-screen__table">
                    <h2><IconList/>Variables</h2>
                    <Table headers={["Variable", "Value"]} data={InterpreterEntities[activeEnitiyIndex].data.symbols}/>
                </div>
                <div className="interpreter-screen__table">
                     <h2><IconHistory/>Log</h2>
                    <Table headers={["Type", "Value", "Result"]} data={InterpreterEntities[activeEnitiyIndex].data.history}/>
                </div>
            </div>
        </div>
    )
}

const InterpreterInput = () => {

    const InterpreterEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'interpreter') 
    const config = useSelector(state => state.ConfigReducer) 
    const dispatch = useDispatch()
    const activeEnitiyIndex = getActiveEnitiyIndex(InterpreterEntities)


    const getStep = (step) => {
        const isNumeric = (str) => {
            if (typeof str != "string") return false // we only process strings!  
            return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                   !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
          }
        try {
            const arr = step.replace("^","^^").split(",")
            if (arr.length === 3 && isNumeric(arr[0]) && isNumeric(arr[2])) {
                console.log(step)

                const cmd = JSON.stringify(config.InterpeterPath) + " " + JSON.stringify("expression") + " " + JSON.stringify("[" + JSON.stringify(arr.join(' ')) + "]")
                //console.log(cmd)
                var result = window.require('child_process').execSync(cmd).toString();      
                const parsedResult = JSON.parse(result)  
                
                if (parsedResult.status &&  parsedResult.status === "good") { return parsedResult }
                else { return false }
            }
        } catch (error) {
            return false
        }
        return false
    }


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
            let args = expressionList.map(expr => {
                return expr
                .replace(/"\\"/g, "'")
                .replace(/\\""/g, "'")
                .replace("^", "^^")
            })
            const cmd = JSON.stringify(config.InterpeterPath) + " " + JSON.stringify("expression") + " " + JSON.stringify(JSON.stringify(args))
            console.log(cmd)
            var result = window.require('child_process').execSync(cmd).toString();
            const response = JSON.parse(result)          

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
                let stepsList = []
                response.ops.forEach(step => {
                    let parsedStep = getStep(step)
                    //console.log(parsedStep)
                    if (parsedStep !== false)

                    { 
                        console.log(step.split(",").join(" "),parsedStep)
                        stepsList.push({"step":step.split(",").join(" "), "result":parsedStep.output}) }
                    else
                    { return }
                });
                console.log(stepsList)
                InterpreterEntities[activeEnitiyIndex].data.symbols = symbols
                InterpreterEntities[activeEnitiyIndex].analysis.steps = stepsList
                dispatch(updateEntity(InterpreterEntities[activeEnitiyIndex]))
            }
            else if (response.status && response.status == "bad") 
            {
                dispatch(addNotification({'text':`${response.type} - ${response.error} Location: ${response.location}`, 'loader':false}))
            }   
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
            <input id="expression" type="text" className='input--text input--full interpreter-screen__input' name='equation' placeholder="Enter expression e.g. 2*(5-3)+6" defaultValue={"0.2*(3^2)+2*5+7"}></input>
            <div className="interpreter-screen__controls">
                <IconEnter className="icon-button" onClick={enterExpression}/>
                <IconReload className="icon-button" onClick={reset}/>
            </div>
            <div className="interpreter-screen__result">                   
                <label>Expression: {output.expression}</label>
                <label>Result:{output.value}</label>
            </div>
            <div className="interpreter-screen__steps">
                {
                    InterpreterEntities[activeEnitiyIndex].analysis.steps &&
                    InterpreterEntities[activeEnitiyIndex].analysis.steps.map((step, index) => {
                        return <Step key={index} count={index+1} value={step.step + " = " + step.result}></Step>
                    })
                }
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