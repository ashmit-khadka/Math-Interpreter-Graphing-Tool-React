import React, { useRef, useEffect, useState } from "react";
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
  zoomTransform
} from "d3";

const data = Array.from({ length: 50 }, () => Math.round(Math.random() * 100))

const Graph = (props) => {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [currentZoomState, setCurrentZoomState] = useState();
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    //console.log(props.lines)
    // will be called initially and on every data change
    useEffect(() => {

        createGraph()

    }, [currentZoomState, data, props.lines]);

    const createGraph = () => {

        const svg = select(svgRef.current);
        const svgContent = svg.select(".content");
        const width = 600 //window.innerWidth
        const height = 600 //window.innerHeight
    
    
        // scales + line generator
        const xScale = scaleLinear()
            .domain([-(data.length), data.length])
            .range([0, width - 10]);
    
        const yScale = scaleLinear()
            .domain([-(max(data)), max(data)])
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
    
            XAxisPos = calcXAxisPos(newYScale(0))
            YAxisPos = calcYAxisPos(newXScale(0))
            //console.log(`x axis pos: ${XAxisPos}, y axis pos: ${YAxisPos}`)
    
            xScale.domain(newXScale.domain());
            yScale.domain(newYScale.domain());
        }    
    
        const lineGenerator = line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(curveCardinal);

       if (props.lines) {
            svgContent.selectAll("path").remove();        
            for(let i=0; i<props.lines.length; i++){

                if (props.lines[i].visible) {
                    svgContent
                        .append("path")
                        .data([props.lines[i].data])
                        .attr("class", "line")
                        .attr("fill", "none")
                        .attr("stroke", `rgba(${props.lines[i].colour.r}, ${props.lines[i].colour.g}, ${props.lines[i].colour.b}, ${props.lines[i].colour.a})`)
                        .attr("d", lineGenerator)
                }
            }
        }

        if (props.points) {
            svgContent.selectAll("circle").remove();
            for(let i=0; i<props.points.length; i++){
                svgContent
                    .selectAll("dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "graph-point")
                    .attr("r", 5)
                    .attr("cx", function(d) { return xScale(props.points[i].value.x); })
                    .attr("cy", function(d) { return yScale(props.points[i].value.y); })            
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
            .scaleExtent([0.05, 30])
            .translateExtent([
            [0, 0],
            [width, height]
            ])
            .on("zoom", () => {
            const zoomState = zoomTransform(svg.node());
            setCurrentZoomState(zoomState);
            });
    
        svg.call(zoomBehavior);  

    }

    return (
        <div ref={wrapperRef}>
            <svg ref={svgRef} className="testSVG">
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