"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import returnStateName from "../../../public/data/stateName";

export default function Map() {
  const [data, setData] = useState(null);
  const svgRef = useRef();
  const tooltipRef = useRef();
  const stateName = returnStateName();

  // Fetch and update data
  const updateData = async (dataPath) => {
    try {
      const res = await fetch(dataPath);
      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      console.error(`Error fetching data from ${dataPath}:`, error);
    }
  };

  // Initial data load
  useEffect(() => {
    updateData(`/data/AccidentsByStatesFrom2016To2023.json`);
  }, []);

  useEffect(() => {
    const renderMap = async () => {
      if (!data) return;

      const width = Math.max(window.innerWidth * 0.9, 800);
      const height = Math.max(window.innerHeight * 0.8, 600);
      const largest = Math.max(...Object.values(data));

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      // Create a tooltip div
      const tooltip = d3.select(tooltipRef.current).style("opacity", 0);

      try {
        const geoData = await d3.json("/data/USGeojson.geojson");

        // Use Albers USA projection
        const projection = d3
          .geoAlbersUsa()
          .fitSize([width - width / 14, height], geoData);
        const path = d3.geoPath().projection(projection);

        svg
          .selectAll("path")
          .data(geoData.features)
          .join("path")
          .attr("d", path)
          .attr("class", "state")
          .attr("fill", (d) => {
            const state = d.properties.NAME;
            const value =
              data[
                Object.keys(stateName).find((key) => stateName[key] === state)
              ];
            if (value > 0) {
              // Use a logarithmic scale for balanced steel blue shades
              const logScale = d3
                .scaleLog()
                .domain([1, largest]) // Avoid 0 as log(0) is undefined
                .range(["#ccddf3", "#0b5591"]); // Light steel blue to steel blue
              return logScale(value);
            }
            return "lightgray"; // Default color for states with no data
          })
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .on("mouseover", (event, d) => {
            const state = d.properties.NAME;
            const stateData =
              data[
                Object.keys(stateName).find((key) => stateName[key] === state)
              ];
            tooltip.transition().duration(200).style("opacity", 1);
            const formatNumber = d3.format(",");

            tooltip
              .html(
                `<strong>${state || "Unknown"}</strong><br/>Value: ${
                  stateData ? formatNumber(stateData) : "N/A"
                }`
              )
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mousemove", (event) => {
            tooltip
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0);
          });
      } catch (error) {
        console.error("Error fetching or processing GeoJSON:", error);
      }
    };

    renderMap();
  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          textAlign: "center",
          width: "120px",
          padding: "8px",
          fontSize: "12px",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "4px",
          pointerEvents: "none",
          boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
        }}
      ></div>
    </div>
  );
}
