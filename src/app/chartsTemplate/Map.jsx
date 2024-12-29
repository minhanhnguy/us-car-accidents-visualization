"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import returnStateData from "../../../public/data/stateCode";

export default function Map() {
  const [data, setData] = useState(null);
  const [geoJsonPath, setGeoJsonPath] = useState("/data/us-states.json");
  const svgRef = useRef();
  const tooltipRef = useRef();
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
    const dataPath = geoJsonPath.includes("states")
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

  const renderMap = async () => {
    if (!data) return;

    const width = Math.max(window.innerWidth * 0.9, 800);
    const height = Math.max(window.innerHeight * 0.8, 600);
    const largest = Math.max(...Object.values(data));

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
      .domain([1, largest])
      .range(["#ddeeff", "#08306b"]);

    const zoom = d3.zoom().on("zoom", (event) => {
      svg.selectAll("g").attr("transform", event.transform);
    });

    svg.call(zoom);

    const mapGroup = svg.append("g");

    const handleMouseOver = (event, region) => {
      const regionData = getValue(region, geoJsonPath.includes("counties"));
      tooltip.transition().duration(200).style("opacity", 1);
      const formatNumber = d3.format(",");
      tooltip
        .html(
          `<strong>${region.properties.NAME || "Unknown"}</strong><br/>Value: ${
            regionData ? formatNumber(regionData) : "N/A"
          }`
        )
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    };

    const handleMouseMove = (event) => {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
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
        const value = getValue(d, geoJsonPath.includes("counties"));
        return value > 0 ? colorScale(value) : "#ddeeff";
      })
      .attr("stroke", "white")
      .attr("stroke-width", 0.3)
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseOut);

    svg.transition().duration(1000).call(
      zoom.transform,
      d3.zoomIdentity.translate(0, 0).scale(1)
    );
  };

  useEffect(() => {
    updateData();
  }, [geoJsonPath]);

  useEffect(() => {
    renderMap();
  }, [data, geoJsonPath]);

  const toggleGeoJson = () => {
    setGeoJsonPath((prevPath) =>
      prevPath.includes("states") ? "/data/us-counties.json" : "/data/us-states.json"
    );
  };

  return (
    <div>
      <button onClick={toggleGeoJson}>
        {geoJsonPath.includes("states") ? "Counties" : "States"}
      </button>
      <svg ref={svgRef} className=""></svg>
      <div
        ref={tooltipRef}
        className="tooltip"
      ></div>
    </div>
  );
}
