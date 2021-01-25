import React, { useState } from 'react'
import { ReactComponent as IconAdd} from '../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../assets/icons/saving-disc.svg'
import { ReactComponent as IconRemove} from '../assets/icons/remove.svg'

const GridRow = (props) => {
    //console.log(props.id)
    const [isHover, setIsHover] = useState(false)

    const onChange = () => {   
        let newEntry = {}
        for (const [key, value] of Object.entries(props.data)) {
            let cellData = document.getElementById(`gr-${props.id}-${key}`).value
            newEntry[key] = cellData === "" ? 0 : parseFloat(cellData)
        }
        props.onChange(props.id, newEntry)

    }

    let fields = []
    for (const [key, value] of Object.entries(props.data)) {
        fields.push(
            <div key={`${props.id}-${key}`} className={"grid-row__cell"}>
                <input  id={`gr-${props.id}-${key}`} className="" type="number" value={value} onChange={onChange}></input>
            </div>
        )
    }


    return (
        <div className="grid-row" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <div className="grid-row__cell grid-row__cell--num">
                {isHover ? <IconRemove onClick={() => props.onRemove(props.id)}/> : <span>{props.id}</span>} 
            </div>
            { fields }
        </div>
    )
}

const Grid = (props) => {

    return (
        <div>
            <div className="data-row">
                <div className="data-row__cell data-row__cell--num">
                </div>
                {
                    props.headers.map((header, index) => {
                        return(
                            <div key={index} className="grid-row__cell grid-row__cell--header">
                                <input className="headerss" type="text" value={header} readOnly></input>
                            </div>
                        )
                    })
                }            
            </div>
            {
                props.data.map((point, index) => {
                    return <GridRow key={index} id={index} data={point} onChange={props.onChange} onRemove={props.onRemove}/>
                })
            }
        </div>
    )
}

export default Grid