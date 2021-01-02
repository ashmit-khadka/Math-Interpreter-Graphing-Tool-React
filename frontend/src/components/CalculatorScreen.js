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
  
const CalculatorScreen = () => {

    const [backResponse, setBackResponse] = useState('')
    const { register, handleSubmit, errors, reset } = useForm()
    const [variableInputs, setVariableInputs] = useState([])
    const [result, setResult] = useState("")

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


    
    const threadCMD = (path, args) => {

        let cmd = JSON.stringify(path)
        args.forEach(element => {
            cmd += ' ' + JSON.stringify(element)
        });

        const exec = window.require('child_process').exec;
        let result = '';    
        console.log(cmd)
        const child = exec(cmd);   
        return child
    }

    
    const calculate = () => {
        let data = document.getElementById("eq").value

        console.log(JSON.stringify(data))

        let threadChild = threadCMD(
            "C:\\Users\\ashmit.khadka\\Documents\\UEA\\CMP-6048A ADVANCED PROGRAMMING CONCEPTS AND TECHNIQUES\\Coursework 1\\InterpreterCore2\\InterpreterCore\\bin\\Debug\\netcoreapp3.1\\InterpreterCore.exe"
            , [
                JSON.stringify(data)      
        ])
        let result = ''
        let rows = []
        threadChild.stdout.on('data', function(data) {
            result += data;
        });    
        threadChild.on('close', function() {        
            const values = JSON.parse(result)
            console.log(values)
            setResult(values.result)
            document.getElementById("eq").value = ""
        });
    }




    return (
        <div>
            <div className='testObj'>
                <h2>Enter formula</h2>
                <div className='user-input'>
                    <input id="eq" type='text' className='user-input--text' name='equation' placeholder="e.g (4^2)*3+6" ref={register}></input>
                    {/*<button className='user-input--button' type='submit'>Solve!</button>*/}
                    <button className='user-input--button' onClick={calculate} >Solve!</button>

                </div>
                <span className='response'>{"\nResult: " + result}</span>
                {/*variableInputs*/}
            </div>
        </div>
    )
}

export default CalculatorScreen