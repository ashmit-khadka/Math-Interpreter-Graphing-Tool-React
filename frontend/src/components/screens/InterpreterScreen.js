import React from 'react'
import Tab from '../Tab'
import { ReactComponent as IconEnter} from '../../assets/icons/enter.svg'
import { ReactComponent as IconReload} from '../../assets/icons/reload.svg'

const TableRow = (props) => {
    return (
        <div>
            <div className="table-row">
                <label>{props.column[0]}</label>
                <label>{props.column[1]}</label>
            </div>
        </div>
    )
}

const Table = () => {

    const sampleData = {
        'x':5,
        'c':20,
        'd':3.4
    }


    return (
        <div>
            <div className="table-row table-row__header">
                <label>Name</label>
                <label>Value</label>
            </div>
            {Object.keys(sampleData).map((key, index) => {
                return <TableRow key={index} column={[key,sampleData[key]]} />
            })}
        </div>
    )
}

const InterpreterScreen = () => {
    return (
        <div className="interpreter-screen">
            <div className="interpreter-screen__equation">
                <input id="" type="text" className='input--text input--full' name='equation' placeholder="Enter polynomial.."></input>
                <div className="interpreter-screen__controls">
                    <IconEnter className="icon-button"/>
                    <IconReload className="icon-button"/>
                </div>
            </div>
            <div className="interpreter-screen__log">
                <div>
                    <Table/>
                </div>
                <div>
                    <Table/>

                </div>
            </div>
        </div>
    )
}

export default InterpreterScreen