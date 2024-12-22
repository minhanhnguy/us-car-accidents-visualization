"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";

export default function Map() {
  const [data, setData] = useState(null);
  const [geoJsonPath, setGeoJsonPath] = useState("/data/us-states.json");
  const svgRef = useRef();
  const tooltipRef = useRef();

  // Fetch and update data
  const updateData = async () => {
    try {
      const res = await fetch("/data/AccidentsByStatesFrom2016To2023.json");
      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    updateData();
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

      const tooltip = d3.select(tooltipRef.current).style("opacity", 0);

      try {
        const geoData = await d3.json(geoJsonPath);

        // Clear previous map
        svg.selectAll("*").remove();

        const projection = d3.geoAlbersUsa().fitSize([width, height], geoData);

        const path = d3.geoPath().projection(projection);

        svg
          .selectAll("path")
          .data(geoData.features)
          .join("path")
          .attr("d", path)
          .attr("fill", (d) => {
            const region = d.properties.NAME; // Assumes NAME corresponds to state/county
            const value = data[region];
            if (value > 0) {
              const logScale = d3
                .scaleLog()
                .domain([1, largest])
                .range(["#ddeeff", "#08306b"]);
              return logScale(value);
            }
            return "lightgray";
          })
          .attr("stroke", "white")
          .attr("stroke-width", 0.3)
          .on("mouseover", (event, d) => {
            const region = d.properties.NAME;
            const regionData = data[region];
            tooltip.transition().duration(200).style("opacity", 1);
            const formatNumber = d3.format(",");

            tooltip
              .html(
                `<strong>${region || "Unknown"}</strong><br/>Value: ${
                  regionData ? formatNumber(regionData) : "N/A"
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
  }, [data, geoJsonPath]);

  const toggleGeoJson = () => {
    setGeoJsonPath((prevPath) =>
      prevPath.includes("states")
        ? "/data/us-counties.json"
        : "/data/us-states.json"
    );
  };

  return (
    <div>
      <button onClick={toggleGeoJson}>
        {geoJsonPath.includes("states") ? "Counties" : "States"}
      </button>
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
