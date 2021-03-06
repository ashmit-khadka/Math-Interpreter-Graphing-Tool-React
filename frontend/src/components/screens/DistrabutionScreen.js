import React, { useState, useEffect } from 'react';
import GraphB from '../GraphB';
import Selector from '../Selector'
import Tab from '../Tab';
import Grid from '../Grid';
import { ReactComponent as IconAdd} from '../../assets/icons/add.svg'
import { ReactComponent as IconOpenFile} from '../../assets/icons/open-file.svg'
import { ReactComponent as IconSaveFile} from '../../assets/icons/saving-disc.svg'
import {execShellCommand} from '../../scripts/threader'
import { CSVFileReader, CSVFileWritter } from '../../scripts/fileReader'
import { randomRGBA, round, getActiveEnitiyIndex } from '../../scripts/tools'
import { ReactComponent as IconCopy} from '../../assets/icons/copy.svg'
import { ReactComponent as IconClear} from '../../assets/icons/reload.svg'
import EmptyEntity from '../EmptyEntity'
import {CopyToClipboard} from 'react-copy-to-clipboard';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { addEntity, updateEntity, removeEntity, selectEntity } from '../../redux/actions/EntityActions'
import { addNotification } from '../../redux/actions/NotificationActions';


const DistrabutionScreen = () => {

    const distributionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'distribution') 
    const config = useSelector(state => state.ConfigReducer)
    const graphConfig = useSelector(state => state.GraphReducer)
    const dispatch = useDispatch()
    const [isCalculating, SetIsCalculating] = useState(false)
    const activeEnitiyIndex = getActiveEnitiyIndex(distributionEntities)
    console.log(activeEnitiyIndex, distributionEntities)

    const [graphRegion, setGraphRegion] = useState({
        'domain': graphConfig.domain,
        'range': graphConfig.range,
    })

    useEffect(()=>{
        if (distributionEntities.length>0) {SetIsCalculating(false)}
        else {SetIsCalculating(true)}    
    },[distributionEntities])

    const addDistributionEnitiy = () => {
        return addEntity({            
            'id': null,
            'type':'distribution',
            'title': null,
            'colour': randomRGBA(),
            'data': [],
            'analysis': {
                'type': 'sample',
                'mean': null,
                'variance': null,
                'sd':null,
                'SeMean':null,
                'size':null,
                'sum':null,
                'pdCurve':[],
                'rank':null,
                'percentile':null,
                'rankRequest':null,
                'percentileRequest':null,
                'probability': {
                    'type':'none',
                    'domain1':null,
                    'domain2':null,
                    'value':null,
                },
            },
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

    const getProbability = () => {

        const selectedType = document.getElementById("probabilityType").value
        const xVar1 = document.getElementById("xVal1").value 
        const xVar2 = document.getElementById("xVal2").value 


        const args = {
            "data":distributionEntities[activeEnitiyIndex].data.map(point => point.x),
            "area":JSON.stringify(selectedType),
            "boundries":[]
        }

        switch (selectedType) {
            case 'above':
                args.boundries.push(parseFloat(xVar1))
                break;
            case 'below':
                args.boundries.push(parseFloat(xVar1))
                break;
            case 'between':
                args.boundries.push(parseFloat(xVar1))
                args.boundries.push(parseFloat(xVar2))
                if (parseFloat(xVar2)<parseFloat(xVar1)) {
                    dispatch(addNotification({"text":"Range 2 must be greater than Range 1","loader":false}))
                    return
                }
                
                break;
            case 'outside':
                args.boundries.push(parseFloat(xVar1))
                args.boundries.push(parseFloat(xVar2))
                if (parseFloat(xVar2)<parseFloat(xVar1)) {
                    dispatch(addNotification({"text":"Range 2 must be greater than Range 1","loader":false}))
                    return
                }
                break;
        }

        console.log(args)

        
            execShellCommand(
                config.MathsHandler.path,
                [
                    config.MathsHandler.commands.distribution_probability,
                    args
                ] 
            ). then(response => {
                console.log(response)
                if (response.status && response.status === "good") {
                    if (response.data.probability >= 1) { distributionEntities[activeEnitiyIndex].analysis.probability.value = 0.9999999 }
                    else if (response.data.probability <= 0) { distributionEntities[activeEnitiyIndex].analysis.probability.value = 0.00001 }
                    else { distributionEntities[activeEnitiyIndex].analysis.probability.value = response.data.probability }
                    console.log(response.data.probability)
                    dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))
                }
            })  
            
        }

       

    const analyse = () => {
        //console.log(JSON.stringify(distributionEntities[activeEnitiyIndex].data.map(point => point.x)))
        if (distributionEntities[activeEnitiyIndex].data.length < 3) {
            dispatch(addNotification({"text":"Please enter atleast 3 points","loader":false}))
            return
        }

        const rankRequest = distributionEntities[activeEnitiyIndex].analysis.rankRequest
        const percentileRequest = distributionEntities[activeEnitiyIndex].analysis.percentileRequest
        const selectedType = distributionEntities[activeEnitiyIndex].analysis.probability.type 
        const dataFormatted = distributionEntities[activeEnitiyIndex].data.map(point => point.x)

        console.log(JSON.stringify({"dataType":distributionEntities[activeEnitiyIndex].analysis.type,"data":dataFormatted}))
        
        execShellCommand(
            config.MathsHandler.path,
            [
                config.MathsHandler.commands.distribution_profile,
                JSON.stringify({"dataType":distributionEntities[activeEnitiyIndex].analysis.type,"data":dataFormatted})
            ] 
        )
        .then(response => {      

            if (response.status && response.status === "good") {
                console.log(response)

                const pdCurve = response.data.pdCurve.map(point => { return {"x":point[0], "y":point[1]}})
                distributionEntities[activeEnitiyIndex].elements.lines = [pdCurve]
                distributionEntities[activeEnitiyIndex].analysis.pdCurve = pdCurve
                distributionEntities[activeEnitiyIndex].analysis.mean = response.data.mean
                distributionEntities[activeEnitiyIndex].analysis.sd = response.data.sd
                distributionEntities[activeEnitiyIndex].analysis.variance = response.data.variance
                distributionEntities[activeEnitiyIndex].analysis.SeMean = response.data.SeMean
                distributionEntities[activeEnitiyIndex].analysis.size = response.data.n
                distributionEntities[activeEnitiyIndex].analysis.sum = response.data.sum
                distributionEntities[activeEnitiyIndex].analysed = true
                dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))
                updateGraphRegion()
            }

        })      

        if (dataFormatted.length && rankRequest !== undefined && rankRequest !== null && rankRequest !== "") {
            
            if (rankRequest < Math.min(...dataFormatted) || rankRequest > Math.max(...dataFormatted) ) {
                dispatch(addNotification({"text":"Enter rank value within the dataset range","loader":false}))
                return
            }
                
            console.log("getting percentile.. ")
            execShellCommand(
                config.MathsHandler.path,
                [
                    config.MathsHandler.commands.distribution_percentile,
                    JSON.stringify({"data":dataFormatted,"rank":rankRequest}),                    
                ] 
            )
            .then(response => {      
                if (response.status && response.status === "good") {
                    console.log(response)
                    distributionEntities[activeEnitiyIndex].analysis.percentile = response.data.percentile
                    distributionEntities[activeEnitiyIndex].analysed = true
                    dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))    
                }
                
            })
        }
   
        if (dataFormatted.length && percentileRequest !== undefined && percentileRequest !== null && percentileRequest !== "")
        {
            execShellCommand(
                config.MathsHandler.path,
                [
                    config.MathsHandler.commands.distribution_rank,
                    JSON.stringify({"data":dataFormatted,"percentile":percentileRequest}),                    
                ] 
            )
            .then(response => {      
                if (response.status && response.status === "good") {
                    console.log(response)
                    distributionEntities[activeEnitiyIndex].analysis.rank = response.data.rank
                    distributionEntities[activeEnitiyIndex].analysed = true
                    dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))    
                }
            })
        }       
        
        if (selectedType != 'null' && selectedType != "none") {
            getProbability()
        } 
    }


    //Update graph viewport to the dataset.
    const updateGraphRegion = () => {
        let dataArrayX = []
        let dataArrayY = []
        distributionEntities.forEach(entity => {
            if (entity.visible && entity.data.length && entity.analysis.pdCurve.length) {
                entity.data.forEach(point => dataArrayX.push(point.x))
                entity.analysis.pdCurve.forEach(point => dataArrayY.push(point.y))
            }
        })
        const currentMaxX = Math.max(...dataArrayX)
        const currentMaxY = Math.max(...dataArrayY)
        const currentMinX = Math.min(...dataArrayX)  
        //setGraphRegion
        console.log({
            'domain': [currentMinX * .75,currentMaxX * 1.25],
            'range': [-(currentMaxY * .25),currentMaxY],
        })
        setGraphRegion({
            'domain': [currentMinX * .75,currentMaxX * 1.25],
            'range': [-(currentMaxY * .25),currentMaxY],
        })
    }

    const onSelect = (data) => {
        distributionEntities[activeEnitiyIndex].elements.areas = []
        dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))
        return selectEntity(data)
    }

    return (
        <div className="screen">
            {
                distributionEntities.length ?
                <div className="screen__panel">
                    <Selector 
                        reducer={distributionEntities}
                        actionSelect={onSelect}
                        actionEdit={updateEntity}
                        actionRemove={removeEntity}
                        actionAdd={addDistributionEnitiy}                
                    />
                    <Tab 
                        tabs={[
                            {
                                'name':'Analysis',
                                'component': <AnalysisTab/>,
                            },
                            {
                                'name':'Data',
                                'component': <DataTab  />,
                            },
                        ]}    
                    />
                    <button 
                        className={distributionEntities[activeEnitiyIndex].analysed ?
                            'screen__analyse-btn screen__analyse-btn--active' :
                            'screen__analyse-btn screen__analyse-btn--active'
                        }
                        onClick={analyse}
                    >Analyse</button>  
                </div>
                :
                <EmptyEntity
                    reducer={distributionEntities}
                    actionAdd={addDistributionEnitiy}             
                />
            }
            <div className="screen__graph">
                <GraphB items={distributionEntities} activeDomainX={graphRegion.domain} activeDomainY={graphRegion.range} isCalculating={isCalculating}/>
            </div>
        </div>
    )
}

const AnalysisTab = () => {

    const distributionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'distribution') 
    const dispatch = useDispatch()
    const config = useSelector(state => state.ConfigReducer)

    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(distributionEntities)

    //When a user input is changed.
    const onValueChange = (e) => {

        if (distributionEntities[activeEnitiyIndex].analysed) {
            distributionEntities[activeEnitiyIndex].analysed = false
            dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))    
        }

        if (e !== undefined) {
            if (e.target.id === "xVal1")
            {
                distributionEntities[activeEnitiyIndex].analysis.probability.domain1 = e.target.value
                distributionEntities[activeEnitiyIndex].analysis.probability.value = null
                dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))    
                updateProbabilityArea()
            }
            else if (e.target.id === "xVal2" ) {
                distributionEntities[activeEnitiyIndex].analysis.probability.domain2 = e.target.value
                distributionEntities[activeEnitiyIndex].analysis.probability.value = null
                dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))        
                updateProbabilityArea()
            
            
            }
            else if (e.target.id === "request-percentile") {
                if (e.target.value === "" || (parseFloat(e.target.value) > 0 && parseFloat(e.target.value) < 100)) {
                    distributionEntities[activeEnitiyIndex].analysis.percentileRequest = e.target.value
                    dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))  
                }      
            }
            else if (e.target.id === "request-rank") {
                distributionEntities[activeEnitiyIndex].analysis.rankRequest = e.target.value
                dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))        
            }
            else if (e.target.id === "data-sample") {
                if (e.target.checked) {
                    distributionEntities[activeEnitiyIndex].analysis.type = 'sample'
                    dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))        
                }
            }
            else if (e.target.id === "data-population") {
                if (e.target.checked) {
                    distributionEntities[activeEnitiyIndex].analysis.type = 'population'
                    dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))        
                }
            }

        } 
    }

    //When the probability type is changed.
    const onProbabilityTypeChange = () => {
        const selectedType = document.getElementById("probabilityType").value
        distributionEntities[activeEnitiyIndex].analysis.probability.type = selectedType
        distributionEntities[activeEnitiyIndex].analysis.probability.domain1 = ""
        distributionEntities[activeEnitiyIndex].analysis.probability.domain2 = ""
        distributionEntities[activeEnitiyIndex].analysis.probability.result = null
        distributionEntities[activeEnitiyIndex].analysed = false
        dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))
        switch (selectedType) {
            case 'above':
            case 'below':
                document.getElementById("probability-range-1").classList.remove("hide")
                document.getElementById("probability-range-2").classList.add("hide")
                break;
            case 'between':
            case 'outside':
                document.getElementById("probability-range-1").classList.remove("hide")
                document.getElementById("probability-range-2").classList.remove("hide")
                break;
            default:
                document.getElementById("probability-range-1").classList.add("hide")
                document.getElementById("probability-range-2").classList.add("hide")

        }
    }
    

    const updateProbabilityArea = () => {
        if (distributionEntities[activeEnitiyIndex].analysis.pdCurve) {
            const selectedType = document.getElementById("probabilityType").value 
            if (selectedType === 'none') {
                return
            }  
            const dataArrayY = distributionEntities[activeEnitiyIndex].analysis.pdCurve.map(point => point.y)
            const currentMaxY = Math.max(...dataArrayY)    
            const xVar1 = document.getElementById("xVal1").value 
            const xVar2 = document.getElementById("xVal2").value     
            distributionEntities[activeEnitiyIndex].elements.areas = []    
            switch (selectedType) {
                case 'above':
                    distributionEntities[activeEnitiyIndex].elements.areas.push([
                        {"x":xVar1, "y":currentMaxY},
                        {"x": 1000, "y":currentMaxY}
                    ])
                    break;
                case 'below':
                    distributionEntities[activeEnitiyIndex].elements.areas.push([
                        {"x":xVar1, "y":currentMaxY},
                        {"x": -1000, "y":currentMaxY}
                    ])
                    break;
                case 'between':
                    distributionEntities[activeEnitiyIndex].elements.areas.push([
                        {"x":xVar1, "y":currentMaxY},
                        {"x": xVar2, "y":currentMaxY}
                    ])
                    break;
                case 'outside':
                    distributionEntities[activeEnitiyIndex].elements.areas.push([
                        {"x":xVar1, "y":currentMaxY},
                        {"x": -1000, "y":currentMaxY}
                    ])
                    distributionEntities[activeEnitiyIndex].elements.areas.push([
                        {"x":xVar2, "y":currentMaxY},
                        {"x": 1000, "y":currentMaxY}
                    ])
                    break;
                default:
                    document.getElementById("probability-range-1").classList.add("hide")
                    document.getElementById("probability-range-2").classList.add("hide")
    
            }
            dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))    
        }
    }    

    const onCopy = () => {
        dispatch(addNotification({"text":"Copied","loader":false}))
    }
  
    return (
        <div className='screen__panel-content'>
            <div className="dist-screen--data-radio">
                <input className="input--radio" type="radio" id="data-sample" name="data-type" onChange={onValueChange} checked={
                    distributionEntities[activeEnitiyIndex].analysis.type === 'sample'
                }></input>
                <label htmlFor="data-sample">Sample</label>
                <input className="input--radio" type="radio" id="data-population" name="data-type" onChange={onValueChange}></input>
                <label htmlFor="data-population">Population</label>
            </div>

            <div className="info-item">
                <label className="label--item">{
                    distributionEntities[activeEnitiyIndex].analysis.type === "sample" ? "Mean (x̄):" : "Mean (μ):"
                }</label> 
                <CopyToClipboard text={
                        distributionEntities[activeEnitiyIndex].analysis.mean && distributionEntities[activeEnitiyIndex].analysis.SeMean ?
                        round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.mean) + " ± " + round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.SeMean) :    
                        "-"
                    }>    
                    <label className="label--text" onClick={onCopy}>{
                        distributionEntities[activeEnitiyIndex].analysis.mean && distributionEntities[activeEnitiyIndex].analysis.SeMean ?
                        round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.mean) + " ± " + round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.SeMean) :    
                        "-"
                    }<IconCopy/></label>
                </CopyToClipboard>

            </div>

            <div className="info-item">
                <label className="label--item">Standard Deviation (σ):</label>    
                <CopyToClipboard text={distributionEntities[activeEnitiyIndex].analysis.sd || "-"}>
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.sd) || "-"}<IconCopy/></label>
                </CopyToClipboard>
            </div>

            <div className="info-item">
                <label className="label--item">Variance (σ²):</label>
                <CopyToClipboard text={distributionEntities[activeEnitiyIndex].analysis.variance || "-"}>    
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.variance) || "-"}<IconCopy/></label>
                </CopyToClipboard>

            </div>

            <div className="info-item">
                <label className="label--item">Sum (Σx):</label>    
                <CopyToClipboard text={distributionEntities[activeEnitiyIndex].analysis.sum || "-"}>
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.sum) || "-"}<IconCopy/></label>
                </CopyToClipboard>

            </div>

            <div className="info-item">
                <label className="label--item">Size (N):</label>  
                <CopyToClipboard text={distributionEntities[activeEnitiyIndex].analysis.size || "-"}>  
                    <label className="label--text" onClick={onCopy}>{round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.size) || "-"}<IconCopy/></label>
                </CopyToClipboard>

            </div>

            <div            
            >
                <hr className="divider"></hr>
                
                <div className="info-item">
                    <label className="label--item">Probability Calculation:</label>
                    <select className="input--combobox" id="probabilityType" onChange={onProbabilityTypeChange} value={distributionEntities[activeEnitiyIndex].analysis.probability.type || 'none'}>
                        <option value="none">{".."}</option>
                        <option value="above">{"P(X > x)"}</option>
                        <option value="below">{"P(X < x)"}</option>
                        <option value="between">{"P( x < X < y)"} </option>
                        <option value="outside">{"P( X < x1) & P(X > x2)"}</option>
                    </select>
                </div>

                <div className="sub-section">
                    <div id="probability-range-1" className={
                        distributionEntities[activeEnitiyIndex].analysis.probability.type && distributionEntities[activeEnitiyIndex].analysis.probability.type !== "none" ?
                        "info-item" : "info-item info-item--disabled"
                    }>
                        <label>Range 1</label>    
                        <input id="xVal1" type='number' className='input--text' value={distributionEntities[activeEnitiyIndex].analysis.probability.domain1} onChange={onValueChange}></input>
                    </div>
                    <div id="probability-range-2" className={
                        distributionEntities[activeEnitiyIndex].analysis.probability.type && (distributionEntities[activeEnitiyIndex].analysis.probability.type !== "none" && distributionEntities[activeEnitiyIndex].analysis.probability.type !== "above" && distributionEntities[activeEnitiyIndex].analysis.probability.type !== "below") ?
                        "info-item" : "info-item info-item--disabled"
                    }>
                        <label>Range 2</label>
                        <input id="xVal2" type='number' className='input--text' value={distributionEntities[activeEnitiyIndex].analysis.probability.domain2} onChange={onValueChange}></input>
                    </div>
                </div>

                <div className={
                        distributionEntities[activeEnitiyIndex].analysis.probability.type && distributionEntities[activeEnitiyIndex].analysis.probability.type !== "none" ?
                        "info-item" : "info-item info-item--disabled"
                }>
                    <label className="label--item">Result</label>
                    <CopyToClipboard text={distributionEntities[activeEnitiyIndex].analysis.probability.value || "-"}>
                        <label className="label--text" onClick={onCopy}>{round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.probability.value) || "-"}<IconCopy/></label>
                    </CopyToClipboard>

                </div>

                <hr className="divider"></hr>
                
                <div className="info-item">
                    <label className="label--item">Percentile (k):</label>
                    <input id="request-percentile" type="number" className='input--text' onChange={onValueChange} min={1} max={100} value={
                        distributionEntities[activeEnitiyIndex].analysis.percentileRequest ? distributionEntities[activeEnitiyIndex].analysis.percentileRequest : ""

                    }></input>
                </div>

                <div className={
                    distributionEntities[activeEnitiyIndex].analysis.rank ?
                    "info-item" : "info-item info-item--disabled"
                }>
                    <label className="label--item">Result</label>    
                    <CopyToClipboard text={distributionEntities[activeEnitiyIndex].analysis.rank || "-"}>
                        <label className="label--text" onClick={onCopy}>{round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.rank) || "-"}<IconCopy/></label>
                    </CopyToClipboard>

                </div>

                <hr className="divider"></hr>
                <div className="info-item">
                    <label className="label--item">Percentile Value:</label>
                    <input id="request-rank" type="number" className='input--text' onChange={onValueChange} value={
                        distributionEntities[activeEnitiyIndex].analysis.rankRequest ? distributionEntities[activeEnitiyIndex].analysis.rankRequest : ""
                    }></input>
                </div>

                <div className={
                    distributionEntities[activeEnitiyIndex].analysis.percentile ?
                    "info-item" : "info-item info-item--disabled"
                }>
                    <label className="label--item">Result</label>  
                    <CopyToClipboard text={distributionEntities[activeEnitiyIndex].analysis.percentile || "-"}>  
                        <label className="label--text" onClick={onCopy}>{round(config.TO_DP, distributionEntities[activeEnitiyIndex].analysis.percentile) || "-"}<IconCopy/></label>
                    </CopyToClipboard>
                </div>
            </div>
        </div>
    )
}


const DataTab = () => {

    //Redux.
    const dispatch = useDispatch()
    const config = useSelector(state => state.ConfigReducer)
    const distributionEntities = useSelector(state => state.EntityReducer).filter(entity => entity.type === 'distribution') 


    //Get current active item index.
    const activeEnitiyIndex = getActiveEnitiyIndex(distributionEntities)


    const onValueChange = () => {

        if (distributionEntities[activeEnitiyIndex].analysed) {
            distributionEntities[activeEnitiyIndex].analysed = false
            dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))    
        }
    }
    

    const readData = () => {
        CSVFileReader(config.DataHandler.commands.read_distribution, config.DataHandler.path)
        .then(response => { 
            if (response.status && response.status == "good") {
                console.log(response)
                let points = response.data.map(point => {return {"x":point}})
                //response.data.forEach(point => { points.push(point) }) 
                distributionEntities[activeEnitiyIndex].data = points
                dispatch(updateEntity(distributionEntities[activeEnitiyIndex])) 
                dispatch(addNotification({"text":"Data imported", "loader":false}))

            }
            else if (response.status && response.status == "bad") {
                dispatch(addNotification({"text":"Could not import data", "loader":false}))

            }
        })
    }

    const addPoint = () => {
        distributionEntities[activeEnitiyIndex].data.push({"x":0})
        dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))
        onValueChange()
    }

    const updatePoint = (index, data) => {

        distributionEntities[activeEnitiyIndex].data[index] = data
        dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))
        onValueChange()
    }

    const removePoint = (index) => {
        distributionEntities[activeEnitiyIndex].data.splice(index,1)
        dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))
    }

    const clearData = () => {
        distributionEntities[activeEnitiyIndex].data = []
        dispatch(updateEntity(distributionEntities[activeEnitiyIndex]))

    }


    const saveData = () => {
        let requestData = distributionEntities[activeEnitiyIndex].data.map(point => {
            return point.x
        })
        console.log(requestData) 
        CSVFileWritter(config.DataHandler.commands.write_distribution, requestData, config.DataHandler.path)
        .then(response => { 
            console.log(response)
            if (response.status && response.status == "good") {
                dispatch(addNotification({"text":"Saved data", "loader":false}))
            }
            else if (response.status && response.status == "bad") {      
                dispatch(addNotification({"text":"Couldn't saved data", "loader":false}))          
            }
        })
    }

    return (
        <div className="screen__data">
            <div className="screen__controls">
                <IconOpenFile className="icon-button" onClick={readData}/>
                <IconClear className="icon-button" onClick={clearData}/>    
                <IconSaveFile className="icon-button" onClick={saveData}/>       
            </div>
            <Grid headers={["X"]} data={distributionEntities[activeEnitiyIndex].data} onChange={updatePoint} onRemove={removePoint}/>
            <IconAdd className="control__icon" onClick={addPoint}/>    
        </div>
    )
}

export default DistrabutionScreen

