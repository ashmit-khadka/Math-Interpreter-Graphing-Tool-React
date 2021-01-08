import React, { useState } from 'react'
import { ReactComponent as IconAdd} from '../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../assets/icons/saving-disc.svg'
import { ReactComponent as IconRemove} from '../assets/icons/remove.svg'

const GridRow = (props) => {
    
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
            <div key={key} className={"grid-row__cell"}>
                <input  id={`gr-${props.id}-${key}`} className="input-text" type="number" defaultValue={value} onChange={onChange}></input>
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
                            <div key={index} className="data-row__cell data-row__cell--header">
                                <input className="input-text" type="text" defaultValue={header}></input>
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