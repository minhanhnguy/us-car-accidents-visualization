"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import returnStateData from "../../../public/data/stateCode.js";

export default function Map() {
  const [data, setData] = useState(null);
  const [geoJsonPath, setGeoJsonPath] = useState("/data/usStates.json");
  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);
  const svgRef = useRef();
  const tooltipRef = useRef();
  const legendRef = useRef();
  const stateData = returnStateData();

  const fetchData = async (path) => {
    try {
      const res = await fetch(path);
      return await res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const updateData = async () => {
    const dataPath = geoJsonPath.includes("States")
      ? "/data/AccidentsByStatesFrom2016To2023.json"
      : "/data/AccidentsByCountiesFrom2016To2023.json";
    const jsonData = await fetchData(dataPath);
    setData(jsonData);
  };

  const getValue = (region, isCounty) => {
    if (isCounty) {
      return data[`${region.properties.STATEFP}${region.properties.NAME}`];
    }
    const state = stateData.states.find((s) => s.name === region.properties.NAME);
    return state ? data[state.short] : undefined;
  };

  const renderLegend = (colorScale, canvasHeight) => {
    const legendWidth = 6;
    const legendHeight = canvasHeight / 2;
  
    const svg = d3.select(legendRef.current)
      .attr("width", legendWidth + 50)
      .attr("height", legendHeight);
  
    const legendScale = d3.scaleLog()
      .domain(colorScale.domain())
      .range([legendHeight - 20, 0]);
  
    const tickValues = colorScale.ticks(4);
    const legendAxis = d3.axisRight(legendScale)
      .tickValues(tickValues)
      .tickFormat(d3.format(".1s"));
  
    svg.selectAll("*").remove();
  
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "legendGradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%");
  
    const stops = d3.range(0, 1.1, 0.1).map((t) => ({
      offset: `${t * 100}%`,
      color: colorScale(
        Math.pow(
          10,
          Math.log10(colorScale.domain()[0]) +
            t * (Math.log10(colorScale.domain()[1]) - Math.log10(colorScale.domain()[0]))
        )
      ),
    }));
  
    stops.forEach(({ offset, color }) => {
      gradient.append("stop").attr("offset", offset).attr("stop-color", color);
    });
  
    svg.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight - 20)
      .style("fill", "url(#legendGradient)");
  
    svg.append("g")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .selectAll("text")
      .style("font-size", "10px")
      .attr("dy", "0.2em");
  };

  const renderMap = async () => {
    if (!data) return;
  
    const width = Math.max(window.innerWidth * 0.9, 800);
    const height = Math.max(window.innerHeight * 0.8, 600);
    const largest = Math.max(...Object.values(data));
    const isCounty = geoJsonPath.includes("Counties");
  
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "hidden")
      .style("position", "relative");
  
    const tooltip = d3.select(tooltipRef.current).style("opacity", 0);
  
    const geoData = await fetchData(geoJsonPath);
    if (!geoData) return;
  
    svg.selectAll("*").remove();
  
    const projection = d3.geoAlbersUsa().fitSize([width, height], geoData);
    const path = d3.geoPath().projection(projection);
  
    const colorScale = d3
      .scaleLog()
      .domain([1, isCounty ? largest : largest * 170])
      .range(["#e4fae3", "#0f9908"]);
  
    const zoom = d3.zoom().on("zoom", (event) => {
      const transform = event.transform;
      setZoomTransform(transform);
      svg.selectAll("g").attr("transform", transform);
    });
  
    svg.call(zoom);
  
    const mapGroup = svg.append("g").attr("transform", zoomTransform);
  
    const handleMouseOver = (event, region) => {
      const regionData = getValue(region, isCounty);
      tooltip.transition().duration(200).style("opacity", 1);
      const formatNumber = d3.format(",");
      tooltip
        .html(
          `<strong>${region.properties.NAME || "Unknown"}</strong><br/>Value: ${
            regionData ? formatNumber(regionData) : "N/A"
          }`
        )
    };
  
    const handleMouseMove = (event) => {
      tooltip
        .style("left", `${event.pageX - 100}px`)
        .style("top", `${event.pageY - 200}px`);
    };
  
    const handleMouseOut = () => {
      tooltip.transition().duration(200).style("opacity", 0);
    };
  
    mapGroup
      .selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", path)
      .attr("fill", (d) => {
        const value = getValue(d, isCounty);
        return value > 0 ? colorScale(value) : "#e4fae3";
      })
      .attr("stroke", "white")
      .attr("stroke-width", 0.3)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);
  
    renderLegend(colorScale, height);
  };
  

  useEffect(() => {
    updateData();
  }, [geoJsonPath]);

  useEffect(() => {
    renderMap();
  }, [data, geoJsonPath]);

  const toggleGeoJson = () => {
    setGeoJsonPath((prevPath) =>
      prevPath.includes("States") ? "/data/usCounties.json" : "/data/usStates.json"
    );
  };

  return (
    <div style={{ position: "relative", display: "flex" }}>
      <svg
        ref={legendRef}
        style={{
          position: "absolute",
          left: "7px",
          top: "7.5%",
          zIndex: 10,
          border: "0px solid black",
          borderRadius: "0",
        }}
      ></svg>
      <div style={{ flex: 1, position: "relative" }}>
        <button
          onClick={toggleGeoJson}
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
            margin: 0,
            zIndex: 10,
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: "white",
          }}
        >
          {geoJsonPath.includes("States") ? "Switch to County Scale" : "Switch to State Scale"}
        </button>
        <svg ref={svgRef} className="canvas"></svg>
        <div ref={tooltipRef} className="tooltip"></div>
      </div>
    </div>
  );
}
