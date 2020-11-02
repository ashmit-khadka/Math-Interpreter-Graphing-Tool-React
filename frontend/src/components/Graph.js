import React, { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
//import { curveCardinal, values } from 'd3';
import {
    select,
    line,
    curveCardinal,
    axisBottom,
    axisRight,
    scaleLinear,
    gray,
  } from "d3";
  
  var resizeTimer;

  const Home = () => {

    const [backResponse, setBackResponse] = useState('')
    const { register, handleSubmit, errors, reset } = useForm()

    const [valueRange, setValueRange] = useState(5)
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const svgRef = useRef()
    
    let data = []


    //console.log(graphWidth)
    
    useEffect(() => {
        createGraph()
    }, [valueRange, dimensions])


    
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
    
    //console.log(dimensions)

    const findMin = a => {
        //console.log(a)
        let minimum = Math.abs(a[0])
        a.forEach(element => {
            const abs = Math.abs(element)
            //console.log(element)
            if (abs > minimum) minimum = abs 
        });
        return minimum
    }

    const createGraph = () => {
        //generate points y = ax^2+bx+c


        for(let i=-valueRange; i<=valueRange; i++) {
            data.push(Math.pow(i, 2)-10)
        }
        const absWidth = 5
        const absHeight = findMin(data)
        //console.log('arr len', data.length)
    
        const svg = select(svgRef.current);


        //Create scales
        //maps the relation of domain to range (e.g. 6 items to 500px)
        const xScale = scaleLinear()
          .domain(([-(absHeight), absHeight]))
          .range([0, dimensions.width-100]);
    
        const yScale = scaleLinear()
          .domain([-(absHeight), absHeight])
          .range([dimensions.height-100, 0]);


        //Create axis'
        const xAxis = axisBottom(xScale).ticks(30)

        svg
          .select("#x-axis")
          .style("transform", `translateY(${(dimensions.height-100)/2}px)`)
          .call(xAxis);
    
        const yAxis = axisRight(yScale).ticks(30)

        svg
          .select("#y-axis")
          .style("transform", `translateX(${(dimensions.width-100)/2}px)`)
          .call(yAxis);


        //Create gridlines
        const xAxisGrid = axisBottom(xScale).tickSize(-dimensions.height).tickFormat('').ticks(50);
        const yAxisGrid = axisRight(yScale).tickSize(-dimensions.width).tickFormat('').ticks(50);
        svg.select("#x-axis-grid")
            .style('transform', `translateY(${dimensions.height}px)`)
            .call(xAxisGrid);
        svg.select("#y-axis-grid")
            .style('transform', `translateX(${1550}px)`)
            .call(yAxisGrid);
    
        // generates the "d" attribute of a path element
        const myLine = line()
          .x((value, index) => xScale(index-valueRange))
          .y(yScale)
          .curve(curveCardinal);
    
        // renders path element, and attaches
        // the "d" attribute from line generator above
        svg
          .selectAll(".line")
          .data([data])
          .join("path")
          .attr("class", "line")
          .attr("d", myLine)
          .attr("fill", "none")
          .attr("stroke", "blue");
    }

    return (
        <div className='page'>
                <div className='graph-control'>
                    <button className='graph-control--zoom' onClick={() => {if (valueRange>5) setValueRange(valueRange-1)}}>+</button>
                    <button className='graph-control--zoom'onClick={() => {setValueRange(valueRange+1)}}>-</button>
                </div>
                <svg className="graph" ref={svgRef}>
                    <g id="x-axis-grid" className="graph__axis-grid" />
                    <g id="y-axis-grid" className="graph__axis-grid" />
                    <g id="x-axis" className="graph__axis" />
                    <g id="y-axis" className="graph__axis" />
                </svg>
                <p className="data"></p>
        </div>
    )
}

export default Home