import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'

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
        axios.get(`https://localhost:44347/api/Math?problem=${data.equation}`)
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

        </div>
    )
}

export default Home