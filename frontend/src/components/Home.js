import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { set } from 'd3'

const VariableInput = props => {
    return (
        <div className='variable-input'>
            <span>{props.name} = </span>
            <input type='text' className='user-input--text'></input>
        </div>
    )
}
  
const Home = () => {

    const [backResponse, setBackResponse] = useState('')
    const { register, handleSubmit, errors, reset } = useForm()
    const [variableInputs, setVariableInputs] = useState([])

    const sendData = data => {
        console.log(data)
        axios.get(`https://localhost:44347/api/Math?equation=${data.equation}`)
        .then(response => {
            console.log(response)
            setBackResponse(response.data.result)
            reset()
        })        
    }

    const generateVariableInputs = () => {
        const num = parseInt(document.getElementById('eq').value)
        console.log(num)
        const arr = []
        for (let i = 0; i<num; i++) {
            arr.push(<VariableInput name='x'/>)
        } 
        console.log(arr)
        setVariableInputs(arr)
    }



    return (
        <div>
            <div className='testObj'>
                <h2>Enter formula</h2>
                <form className='user-input' onSubmit={handleSubmit(sendData)}>
                    <input id="eq" type='text' className='user-input--text' name='equation' placeholder="e.g (4^2)*3+6" ref={register}></input>
                    {/*<button className='user-input--button' type='submit'>Solve!</button>*/}
                    <button className='user-input--button' onClick={generateVariableInputs} >Solve!</button>

                </form>
                <span className='response'>{backResponse}</span>
                {variableInputs}
            </div>
        </div>
    )
}

export default Home