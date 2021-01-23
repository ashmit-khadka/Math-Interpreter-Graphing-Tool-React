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
  zoomTransform,
  mouse,
  area,
  zoomIdentity,
  csv
} from "d3";

const data = Array.from({ length: 50 }, () => Math.round(Math.random() * 100))
var resizeTimer = 0
let calculatedDomain = [-1000,1000]
let rangeCount = 0

const Graph = (props) => {
    //console.log(props.lines)
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [currentZoomState, setCurrentZoomState] = useState(zoomIdentity.translate(0, 0));
    const graph = document.getElementById("graph")

    const [dimensions, setDimensions] = useState({
        height: window.innerHeight-50,
        width: window.innerWidth-350-100
    })
    //const graph = select(wrapperRef.current)
    //Adjust graph to resize
    window.addEventListener('resize', ()=> {
        
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
                        // Run code here, resizing has "stopped"
            setDimensions({
                height: graph.offsetHeight,
                width: graph.offsetWidth
            })
            console.log('Resized')
                    
        }, 250);

    })

    //console.log(props.lines)
    // will be called initially and on every data change
    useEffect(() => {
        //console.log('creating graph..')
        createGraph()
        //console.log(props.items)
    }, [currentZoomState, props.lines, props.points, dimensions, props.items]);


    const createGraph2 = () => {
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // append the SVG object to the body of the page


    var SVG = select(svgRef.current)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    //Read the data
    csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

        // Add X axis
        var x = scaleLinear()
            .domain([4, 8])
            .range([ 0, width ]);
        var xAxis = SVG.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(x));
        
        // Add Y axis
        var y = scaleLinear()
            .domain([0, 9])
            .range([ height, 0]);
        var yAxis = SVG.append("g")
            .call(axisLeft(y));
        
        // Add a clipPath: everything out of this area won't be drawn.
        var clip = SVG.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);
        
        // Create the scatter variable: where both the circles and the brush take place
        var scatter = SVG.append('g')
            .attr("clip-path", "url(#clip)")
            
        
        // Add circles
        scatter
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.Sepal_Length); } )
            .attr("cy", function (d) { return y(d.Petal_Length); } )
            .attr("r", 8)
            .style("fill", "#61a3a9")
            .style("opacity", 0.5)
        
        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
   
        const zoomr = zoom()
        //.scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);
     
        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        SVG.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoomr);

        // now the user can zoom and it will trigger the function called updateChart
        
        // A function that updates the chart when the user zoom and thus new boundaries are available
        
        function updateChart() {
                const zoomState = zoomTransform(SVG.node());

                // recover the new scale
                var newX = zoomState.rescaleX(x);
                var newY = zoomState.rescaleY(y);

            
                // update axes with these new boundaries
                xAxis.call(axisBottom(newX))
                yAxis.call(axisLeft(newY))
            
                // update circle position
                scatter
                .selectAll("circle")
                .attr('cx', function(d) {return newX(d.Sepal_Length)})
                .attr('cy', function(d) {return newY(d.Petal_Length)});
            }
        }
    )}

    const createGraph = () => {
        
        let width = dimensions.width
        let height = dimensions.height

        const svg = select(svgRef.current)

        
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")

    
    
        // scales + line generator
        const xScale = scaleLinear()
            .domain([-1000, 1000])
            .range([0, width - 10]);
    
        const yScale = scaleLinear()
            .domain([-1000, 1000])
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
    
          // axes
          const xAxis = 
          svg.append("g")
              .style("transform", `translateY(${XAxisPos}px)`)
              .call(createXaxis(xScale));
      
          const yAxis = 
          svg.append("g")
              .style("transform", `translateX(${YAxisPos}px)`)
              .call(createYaxis(yScale));
      
  
    
        if (currentZoomState) {
            const newXScale = currentZoomState.rescaleX(xScale);
            const newYScale = currentZoomState.rescaleY(yScale);
            XAxisPos = calcXAxisPos(newYScale(0))
            YAxisPos = calcYAxisPos(newXScale(0))
            //console.log(`x axis domain: ${newXScale.domain()}, y axis domain: ${newYScale.domain()}`)
    
            xAxis.call(createXaxis(newXScale))
            yAxis.call(createYaxis(newYScale))

        }    
    


  
    
        // zoom
        const zoomBehavior = zoom()
            //.scaleExtent([0.005, 10000000])
            .translateExtent([
                [0, 0],
                [width, height]
            ])
            .on("zoom", () => {
                const zoomState = zoomTransform(svg.node());
                console.log(zoomState)

                setCurrentZoomState(zoomState);
            });
        svg
            .call(zoomBehavior)
    }

    return (

        <div  ref={svgRef} id="dataviz_axisZoom"></div>

    )
}

export default Graph