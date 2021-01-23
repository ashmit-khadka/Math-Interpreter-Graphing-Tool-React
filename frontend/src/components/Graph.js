import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisTop,
  axisBottom,
  axisLeft,
  axisRight,
  zoom,
  zoomTransform,
  mouse,
  area,
  zoomIdentity
} from "d3";


import { useSelector, useDispatch } from 'react-redux';
import { enableGraphReset, disableGraphReset } from '../redux/actions/GraphActions'


var resizeTimer = 0
let domainUpper = [-10000,10000]
let domainLower = [-100,100]

let domainIn = 200
let domainOut = 20000

const Graph = (props) => {

    const graphConfig = useSelector(state => state.GraphReducer)
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [currentZoomState, setCurrentZoomState] = useState(zoomIdentity.scale(1).translate(0, 0));
    const graph = document.getElementById("graph")
    const [isCalculating, SetIsCalculating] = useState(false)
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight-50,
        width: window.innerWidth-350-100
    })
    const dispatch = useDispatch()
    //const graph = select(wrapperRef.current)
    //Adjust graph to resize
    window.addEventListener('resize', ()=> {
        
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
                        // Run code here, resizing has "stopped"
            if (graph !== null){
                setDimensions({
                    height: graph.offsetHeight,
                    width: graph.offsetWidth
                })
            }

            console.log('Resized')
                    
        }, 250);

    })

    // will be called initially and on every data change
    useEffect(() => {
        createGraph()
    }, [currentZoomState, props.lines, props.points, dimensions, props.items]);

    useEffect(() => {
        if (props.isCalculating !== undefined && props.isCalculating) {
            document.getElementById("graph-svg").classList.add("graph-busy")
        }
        else if (props.isCalculating !== undefined && !props.isCalculating) {
            document.getElementById("graph-svg").classList.remove("graph-busy")
        }
    }, [props]);


    const callRecalculate = () => {
        if (props.onRecalculate)
        { props.onRecalculate(domainUpper, domainLower) }
    }



    useEffect(() => {
        if (graphConfig.reset) {
            console.log('resetting..')
            setCurrentZoomState(zoomIdentity.scale(1).translate(0, 0));
            domainUpper = [-10000,10000]
            domainLower = [-100,100]
            dispatch(disableGraphReset())
        }
    });
     
    const createGraph = () => {

        const svg = select(svgRef.current);
        let width = dimensions.width
        let height = dimensions.height
    
    
        // scales + line generator
        const xScale = scaleLinear()
            .domain(props.activeDomainX ? props.activeDomainX : [-1000, 1000])
            .range([0, width]);
    
        const yScale = scaleLinear()
            .domain(props.activeDomainY ? props.activeDomainY : [-1000, 1000])
            .range([height, 0]);
    
    
        let XAxisPos = xScale(0) //5 needs to be a scalled value.
        let YAxisPos = yScale(0) //5 needs to be a scalled value.
    
        //Insures X and Y axis do not go out of range.
        const calcXAxisPos = (YAxisOrigin) => {
            //console.log(YAxisPos)
            if (YAxisOrigin >= height) return height
            else if (YAxisOrigin <= 0) return 0
            return YAxisOrigin
        }
        const calcYAxisPos = (XAxisOrigin) => {
            //console.log(YAxisPos)
            if (XAxisOrigin >= width) return width
            else if (XAxisOrigin <= 0) return 0
            return XAxisOrigin
        }
    
        const createXaxis = (xScale) => {
            if (XAxisPos >= height) return axisTop(xScale).ticks(10) 
            return axisBottom(xScale).ticks(10)
        }
    
        const createYaxis = (yScale) => {
            if (YAxisPos <= 0) return axisRight(yScale).ticks(10) 
            return axisLeft(yScale).ticks(10)
        }
    
    
    
        if (currentZoomState) {
            const newXScale = currentZoomState.rescaleX(xScale);
            const newYScale = currentZoomState.rescaleY(yScale);
            //console.log(currentZoomState.k)

            XAxisPos = calcXAxisPos(newYScale(0))
            YAxisPos = calcYAxisPos(newXScale(0))
            //console.log(`x axis domain: ${newXScale.domain()}, y axis domain: ${newYScale.domain()}`)
    
            xScale.domain(newXScale.domain());
            yScale.domain(newYScale.domain());
            // /console.log(newXScale.domain()[1]-newXScale.domain()[0])

            const currentScaleSize = xScale.domain()[1]-xScale.domain()[0]
            //console.log(currentScaleSize)


            if (currentScaleSize < domainIn) {
                const halfCurrentScaleSize = currentScaleSize / 4
                //console.log('zoomed in', `new X0=${xScale.domain()[0]+halfCurrentScaleSize} X1=${xScale.domain()[1]-halfCurrentScaleSize}`)
                domainUpper[1] = xScale.domain()[1] + halfCurrentScaleSize
                domainUpper[0] = xScale.domain()[0] - halfCurrentScaleSize
                domainIn = halfCurrentScaleSize
                callRecalculate()

            }
            else if (xScale.domain()[1]>domainUpper[1])
            {
                const newRange = currentScaleSize * 2
                domainUpper[1] = domainUpper[1] + newRange
                domainUpper[0] = xScale.domain()[0] - newRange
                domainIn = currentScaleSize / 4
                callRecalculate()
            }
            else if (xScale.domain()[0]<domainUpper[0])
            {
                const newRange = currentScaleSize * 2
                domainUpper[0] = domainUpper[0] - newRange
                domainUpper[1] = xScale.domain()[1] + newRange
                domainIn = currentScaleSize / 4
                callRecalculate()
            }

                       /*
            if (newXScale.domain()[1]>domainUpper[1])
            {
                domainLower = domainUpper.slice();
                const newRange = (newXScale.domain()[1]-newXScale.domain()[0]) * 2
                domainUpper[1] = domainUpper[1] + newRange
                domainUpper[0] = newXScale.domain()[0] - newRange
                callRecalculate()
            }
            if (newXScale.domain()[0]<domainUpper[0])
            {
                domainLower = domainUpper.slice()
                const newRange = (newXScale.domain()[1]-newXScale.domain()[0]) * 2
                domainUpper[0] = domainUpper[0] - newRange
                domainUpper[1] = newXScale.domain()[1] + newRange
                callRecalculate()
            }
            
 
            if (newXScale.domain()[1]< domainLower[1])
            {
                console.log('yes')
                domainUpper = domainLower.slice();
                const newRange = (newXScale.domain()[1]-newXScale.domain()[0]) / 2
                domainLower[1] = domainLower[1] - newRange
                domainLower[0] = newXScale.domain()[0] - newRange                
                props.onRecalculate(domainUpper, domainLower)
            }

            
            if (newXScale.domain()[0]>domainLower[0])
            {
                domainUpper = domainLower.slice();
                const newRange = (newXScale.domain()[1]-newXScale.domain()[0]) / 2
                domainLower[1] = domainLower[1] - newRange
                domainLower[0] = newXScale.domain()[0] + newRange                
                props.onRecalculate(domainUpper, domainLower)
            }
            */

        }    
    
        const lineGenerator = line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(curveCardinal);

        var areaGenerator = area()
            .x(d => xScale(d.x))
            .y0(yScale(0))
            .y1(d => yScale(d.y))
            .curve(curveCardinal);

        //console.log('lines..', props.lines)
        svg.selectAll("path").remove();        
        svg.selectAll("circle").remove();

        for (let i=0; i<props.items.length; i++) {
            if (props.items[i].visible) {
                for (let j=0; j<props.items[i].elements.areas.length; j++) {       
                    //console.log(props.items[i].elements.areas[j])       
                    svg
                    .append("path")
                    .data([props.items[i].elements.areas[j]])
                    .attr("class", "object-area")
                    .attr("opacity",".5")
                    .attr("stroke-width", 1.5)
                    .attr("d", areaGenerator) 
                }

                svg
                .selectAll("dot")
                .data(props.items[i].elements.dots)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", `rgb(${props.items[i].colour.r}, ${props.items[i].colour.g}, ${props.items[i].colour.b})`)
                .attr("opacity",".7")
                .attr("cx", function(d) { return xScale(d.x); })
                .attr("cy", function(d) { return yScale(d.y); })      

                for (let j=0; j<props.items[i].elements.lines.length; j++) { 
                    svg
                    .append("path")
                    .data([props.items[i].elements.lines[j]])
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", `rgb(${props.items[i].colour.r}, ${props.items[i].colour.g}, ${props.items[i].colour.b})`)
                    .attr("d", lineGenerator)
                }
            }           
        }

        // axes
        const xAxis = createXaxis(xScale);
        svg
            .select(".x-axis")
            .style("transform", `translateY(${XAxisPos}px)`)
            .call(xAxis);
    
        const yAxis = createYaxis(yScale);
        svg
            .select(".y-axis")
            .style("transform", `translateX(${YAxisPos}px)`)
            .call(yAxis);
    
        //Create gridlines
        const xAxisGrid = axisBottom(xScale).tickSize(-height).tickFormat('').ticks(50);
        const yAxisGrid = axisRight(yScale).tickSize(-width).tickFormat('').ticks(50);
        svg.select("#x-axis-grid")
            .call(xAxisGrid)
            .style("transform", `translateY(${height}px`)
            //.style("transform", `translate(${domainOffset.x}px, ${dimensions.height + domainOffset.y}px)`)
    
        svg.select("#y-axis-grid")
            .call(yAxisGrid)
            .style("transform", `translateX(${width}px`)
            //.style("transform", `translate(${dimensions.width + domainOffset.x}px, ${domainOffset.y}px)`)
    
        //Create point gridlines
        const xAxisGridPoint = axisBottom(xScale).tickSize(-height).tickFormat('').ticks(10);
        const yAxisGridPoint = axisRight(yScale).tickSize(-width).tickFormat('').ticks(10);
        svg.select("#x-axis-point-grid")
            .call(xAxisGridPoint)
            .style("transform", `translateY(${height}px`)
            //.style("transform", `translate(${domainOffset.x}px, ${dimensions.height + domainOffset.y}px)`)
    
        svg.select("#y-axis-point-grid")
            .call(yAxisGridPoint)
            .style("transform", `translateX(${width}px`)
            //.style("transform", `translate(${dimensions.width + domainOffset.x}px, ${domainOffset.y}px)`)
    
        // zoom
        const zoomBehavior = zoom()
            //.scaleExtent([0.005, 10000000])
            
            .on("zoom", () => {
                const zoomState = zoomTransform(svg.node());
                setCurrentZoomState(zoomState);
            });
        svg
            .call(zoomBehavior)
    }

    return (
        <div ref={wrapperRef} id="graph" className="graph">

            <svg ref={svgRef} id="graph-svg" className="testSVG ">
                <g id="x-axis-grid" className="graph__svg__axis-grid" />
                <g id="y-axis-grid" className="graph__svg__axis-grid" />
                <g id="x-axis-point-grid" className="graph__svg__axis-grid-point" />
                <g id="y-axis-point-grid" className="graph__svg__axis-grid-point" />
                <g className="x-axis" />
                <g className="y-axis" />
                <g className="content" clipPath={`url(#${''})`}></g>
            </svg>
        </div>
    )
}

export default Graph