import React, { useState, useEffect } from 'react';
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
    extent
  } from "d3";

let lineID = 0

const TestScreen = () => {    

    var ex_chart = example().zoom(true);
  
    var data = [];
    for (var i = 0; i < 100; i++) {
      data.push([Math.random(), Math.random()]);
    }
     select('#chart')
    .append("svg").attr("width", window.innerWidth).attr("height",window.innerHeight)
    .datum(data).call(ex_chart);
    
    function example() {
      var svg;
      var margin = {
        top: 60,
        bottom: 80,
        left: 60,
        right: 0
      };
      var width = 500;
      var height = 400;

      var xscale =  scaleLinear();
      var yscale =  scaleLinear();

      var xaxis =  axisBottom(xscale).ticks(10)
      var yaxis =  axisLeft(yscale).ticks(10)

      var zoomable = true;
    
    
      var xyzoom =    zoom()
        .x(xscale)
        .y(yscale)
        .on("zoom", zoomable ? draw : null);
      var xzoom =    zoom()
        .x(xscale)
        .on("zoom", zoomable ? draw : null);
      var yzoom =    zoom()
        .y(yscale)
        .on("zoom", zoomable ? draw : null);
    
      function chart(selection) {
        selection.each(function(data) {
          svg =  select(this).selectAll('svg').data([data]);
          svg.enter().append('svg');
          var g = svg.append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
          g.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom);
    
          g.append("svg:rect")
            .attr("class", "border")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .style("stroke", "black")
            .style("fill", "none");
    
          g.append("g").attr("class", "x axis")
            .attr("transform", "translate(" + 0 + "," + (height - margin.top - margin.bottom) + ")");
    
          g.append("g").attr("class", "y axis");
    
          g.append("g")
            .attr("class", "scatter")
            .attr("clip-path", "url(#clip)");
    
          g
            .append("svg:rect")
            .attr("class", "zoom xy box")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .style("visibility", "hidden")
            .attr("pointer-events", "all")
            .call(xyzoom);
    
          g
            .append("svg:rect")
            .attr("class", "zoom x box")
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom)
            .attr("transform", "translate(" + 0 + "," + (height - margin.top - margin.bottom) + ")")
            .style("visibility", "hidden")
            .attr("pointer-events", "all")
            .call(xzoom);
    
          g
            .append("svg:rect")
            .attr("class", "zoom y box")
            .attr("width", margin.left)
            .attr("height", height - margin.top - margin.bottom)
            .attr("transform", "translate(" + -margin.left + "," + 0 + ")")
            .style("visibility", "hidden")
            .attr("pointer-events", "all")
            .call(yzoom);
    
          // Update the x-axis
          xscale.domain( extent(data, function(d) {
            return d[0];
          }))
            .range([0, width - margin.left - margin.right]);
    
     
    
          svg.select('g.x.axis').call(xaxis);
    
          // Update the y-scale.
          yscale.domain( extent(data, function(d) {
            return d[1];
          }))
            .range([height - margin.top - margin.bottom, 0]);
    
    
    
          svg.select('g.y.axis').call(yaxis);
    
          draw();
        });
    
        return chart;
      }
    
      function update() {
        var gs = svg.select("g.scatter");
    
        var circle = gs.selectAll("circle")
          .data(function(d) {
            return d;
          });
    
        circle.enter().append("svg:circle")
          .attr("class", "points")
          .style("fill", "steelblue")
          .attr("cx", function(d) {
            return X(d);
          })
          .attr("cy", function(d) {
            return Y(d);
          })
          .attr("r", 4);
    
        circle.attr("cx", function(d) {
          return X(d);
        })
          .attr("cy", function(d) {
            return Y(d);
          });
    
        circle.exit().remove();
      }
    
      function zoom_update() {
        xyzoom =    zoom()
          .x(xscale)
          .y(yscale)
          .on("zoom", zoomable ? draw : null);
        xzoom =    zoom()
          .x(xscale)
          .on("zoom", zoomable ? draw : null);
        yzoom =    zoom()
          .y(yscale)
          .on("zoom", zoomable ? draw : null);
    
        svg.select('rect.zoom.xy.box').call(xyzoom);
        svg.select('rect.zoom.x.box').call(xzoom);
        svg.select('rect.zoom.y.box').call(yzoom);
      }
    
      function draw() {
        svg.select('g.x.axis').call(xaxis);
        svg.select('g.y.axis').call(yaxis);
    
        update();
        zoom_update();
      };
    
      // X value to scale
    
      function X(d) {
        return xscale(d[0]);
      }
    
      // Y value to scale
    
      function Y(d) {
        return yscale(d[1]);
      }
    
      chart.zoom = function (_){
        if (!arguments.length) return zoomable;
        zoomable = _;
        return chart;
      }
    
      return chart;
    }
  
    return (
        <div id="chart"></div>

    )
}

export default TestScreen