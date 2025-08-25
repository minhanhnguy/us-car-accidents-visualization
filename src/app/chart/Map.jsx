"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import returnStateData from "../../../public/data/stateCode.js";
import mapUtils from "../chartUtils/mapUtils.jsx";

export default function Map() {

  const [data, setData] = useState(null);
  const [geoJsonPath, setGeoJsonPath] = useState("/data/usStates.json");
  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);
  const svgRef = useRef();
  const tooltipRef = useRef();
  const legendRef = useRef();
  const stateData = returnStateData();
  const utils = new mapUtils(stateData);

  const updateData = async () => {
    const dataPath = geoJsonPath.includes("States")
      ? "/data/AccidentsByStatesFrom2016To2023.json"
      : "/data/AccidentsByCountiesFrom2016To2023.json";
    const jsonData = await utils.fetchData(dataPath);
    setData(jsonData);
  };

  const renderMap = async () => {
    if (!data) return;
  
    const width = Math.max(window.innerWidth, 800);
    const height = Math.max(window.innerHeight, 600);
    const largest = Math.max(...Object.values(data));
    const isCounty = geoJsonPath.includes("Counties");
  
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "hidden")
      .style("position", "relative");
  
    const tooltip = d3.select(tooltipRef.current).style("opacity", 0);
  
  const geoData = await utils.fetchData(geoJsonPath);
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
      const regionData = utils.getValue(region, isCounty, data);
      tooltip.transition().duration(200).style("opacity", 1);
      const formatNumber = d3.format(",");
      tooltip
        .html(
          `<strong>${region.properties.NAME || "Unknown"}</strong><br/>Value: ${
            regionData ? formatNumber(regionData) : "N/A"
          }`
        );
    };
  
    const handleMouseMove = (event) => {
      tooltip
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY}px`);
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
        const value = utils.getValue(d, isCounty, data);
        return value > 0 ? colorScale(value) : "#e4fae3";
      })
      .attr("stroke", "white")
      .attr("stroke-width", 0.3)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    utils.renderLegend(colorScale, height, legendRef);
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
        }}
      ></svg>
      <div style={{ flex: 1, position: "relative" }}>
        <button onClick={toggleGeoJson}>
          {geoJsonPath.includes("States") ? "Switch to County Scale" : "Switch to State Scale"}
        </button>
        <svg ref={svgRef} className="canvas"></svg>
        <div ref={tooltipRef} className="tooltip"></div>
      </div>
    </div>
  );
}
