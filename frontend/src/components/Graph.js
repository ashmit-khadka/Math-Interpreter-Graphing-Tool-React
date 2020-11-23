import React, { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
//import { curveCardinal, values } from 'd3';
import {
    select,
    line,
    curveCardinal,
    axisTop,
    axisBottom,
    axisLeft,
    axisRight,
    scaleLinear,
    gray,
    mouse,
    drag
  } from "d3";
  
  import { ReactComponent as IconArrowUp} from '../assets/icons/controls/arrow-up.svg'
  import { ReactComponent as IconArrowDown} from '../assets/icons/controls/arrow-down.svg'
  import { ReactComponent as IconArrowLeft} from '../assets/icons/controls/arrow-left.svg'
  import { ReactComponent as IconArrowRight} from '../assets/icons/controls/arrow-right.svg'


  var resizeTimer;

  const Line = () => {
      return (
          <div>

          </div>
      )
  }

  const Graph = (props) => {

    
    const [scale, setScale] = useState(1)
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const [domainOffset, setDomainOffset] = useState({
        x: 0,
        y: 0
    })

    const svgRef = useRef()
    
    //console.log('lines', props.lines.length)
    
    let data = [
        {
            id: 1,
            colour: {r: 245, g: 66, b: 66, a: 1},
            data: []
        },
        {
            id: 2,
            colour: {r: 45, g: 66, b: 66, a: 1},
            data: []
        },
        {
            id: 3,
            colour: {r: 45, g: 66, b: 66, a: 1},
            data: []
        }
    ]

    for(let i=-(50); i<=50; i++) {
        for(let j=0; j<data.length; j++){
            data[j].data.push(Math.pow(i, 2)-10)
        }
    }

    
    useEffect(() => {
        createGraph()
    }, [scale, dimensions, domainOffset, props.lines])


    
    window.addEventListener('resize', ()=> {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
                        // Run code here, resizing has "stopped"
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
            console.log('Resized')
                    
        }, 250);

    })
    

    const createGraph = () => {

        const graphHeight = document.getElementById("graph").clientHeight
        const graphWidth = document.getElementById("graph").clientWidth

        //Create scales
        //maps the relation of domain to range (e.g. 6 items to 500px)
        const xScale = scaleLinear()
          .domain(([((-10+domainOffset.x)*scale), ((10+domainOffset.x)*scale)]))
          .range([0, graphWidth]);
    
        const yScale = scaleLinear()
          .domain([((-10+domainOffset.y)*scale), ((10+domainOffset.y)*scale)])
          .range([graphHeight, 0]);

        //Where in the pixel range, origin of X and Y should be.
        const XAxisOrigin = xScale(0) //5 needs to be a scalled value.
        const YAxisOrigin = yScale(0) //5 needs to be a scalled value.

        //Insures X and Y axis do not go out of range.
        const calcXAxisPos = () => {
            //console.log(YAxisPos)
            if (YAxisOrigin >= graphHeight) return graphHeight
            else if (YAxisOrigin <= 0) return 0
            return YAxisOrigin
        }
        const calcYAxisPos = () => {
            //console.log(YAxisPos)
            if (XAxisOrigin >= graphWidth) return graphWidth
            else if (XAxisOrigin <= 0) return 0
            return XAxisOrigin
        }
        const createXaxis = () => {
            if (YAxisOrigin >= graphHeight) return axisTop(xScale).ticks(10) 
            return axisBottom(xScale).ticks(10)
        }
        const createYaxis = () => {
            if (XAxisOrigin <= 0) return axisRight(yScale).ticks(10) 
            return axisLeft(yScale).ticks(10)
        }
   
        const svg = select(svgRef.current);
        svg.selectAll("path").remove();

        //Create axis'
        const xAxis = createXaxis()
        svg
          .select("#x-axis")
          .style("transform", `translateY(${calcXAxisPos()}px)`)
          .call(xAxis)
          //.style("transform", `translate(${domainOffset.x}px, ${((dimensions.height-100)/2) + domainOffset.y}px)`)
    
        const yAxis = createYaxis()
        svg
          .select("#y-axis")
          .style("transform", `translateX(${calcYAxisPos()}px)`)
          .call(yAxis)
          //.style("transform", `translate(${((dimensions.width-100)/2) + domainOffset.x}px, ${domainOffset.y}px)`)

        //Create gridlines
        const xAxisGrid = axisBottom(xScale).tickSize(-dimensions.height).tickFormat('').ticks(50);
        const yAxisGrid = axisRight(yScale).tickSize(-dimensions.width).tickFormat('').ticks(50);
        svg.select("#x-axis-grid")
            .call(xAxisGrid)
            .style("transform", `translateY(${dimensions.height}px`)
            //.style("transform", `translate(${domainOffset.x}px, ${dimensions.height + domainOffset.y}px)`)

        svg.select("#y-axis-grid")
            .call(yAxisGrid)
            .style("transform", `translateX(${dimensions.width}px`)
            //.style("transform", `translate(${dimensions.width + domainOffset.x}px, ${domainOffset.y}px)`)
    
        const myLine = line()
            .x((value, index) => xScale(index-50))
            .y(yScale)
            .curve(curveCardinal);
        // renders path element, and attaches
        // the "d" attribute from line generator above       

        for(let i=0; i<props.lines.length; i++){
            const name = i==0?'':i
            //console.log(`rgba(${props.lines[i].colour.r}, ${props.lines[i].colour.g}, ${props.lines[i].colour.b}, ${props.lines[i].colour.a})`)
            svg
                .append("path")
                .data([props.lines[i].data])
                .attr("class", "line")
                .attr("d", myLine)
                .attr("fill", "none")
                .attr("stroke", `rgba(${props.lines[i].colour.r}, ${props.lines[i].colour.g}, ${props.lines[i].colour.b}, ${props.lines[i].colour.a})`)
        }
        
        //.attr("stroke", `rgba(${data[i].colour.r}, ${data[i].colour.g}, ${data[i].colour.b}, ${data[i].colour.a})`)
        
        //.style("transform", `translate(${domainOffset.x}px, ${domainOffset.y}px)`)
    }

    return (
        <div id="graph" className='graph'>
            <div className='graph-control graph-control__zoom'>
                <button className='graph-control--button graph-control--zoom-in' onClick={() => {setScale(scale-1)}}>+</button>
                <button className='graph-control--button graph-control--zoom-out'onClick={() => {setScale(scale+1)}}>-</button>
            </div>
            <div className='graph-control graph-control__move'>
                <button name="up" className='graph-control--button graph-control--up' onClick={() => {setDomainOffset({x:domainOffset.x, y:domainOffset.y+1})}}><IconArrowUp/></button>
                <button name="down" className='graph-control--button graph-control--down' onClick={() => {setDomainOffset({x:domainOffset.x, y:domainOffset.y-1})}}><IconArrowDown/></button>
                <button name="left" className='graph-control--button graph-control--left' onClick={() => {setDomainOffset({x:domainOffset.x-1, y:domainOffset.y})}}><IconArrowLeft/></button>
                <button name="right" className='graph-control--button graph-control--right' onClick={() => {setDomainOffset({x:domainOffset.x+1, y:domainOffset.y})}}><IconArrowRight/></button>
            </div>
            <svg className="graph__svg" ref={svgRef}>
                <g id="x-axis-grid" className="graph__svg__axis-grid" />
                <g id="y-axis-grid" className="graph__svg__axis-grid" />
                <g id="x-axis" className="graph__svg__axis" />
                <g id="y-axis" className="graph__svg__axis" />
            </svg>
            <div className='graph__info'>
                <span>{`Scale: ${scale}`}</span>
                <span>{`X: ${domainOffset.x}px`}</span>
                <span>{`Y: ${domainOffset.y}px`}</span>
            </div>

        </div>
    )
}

export default Graph