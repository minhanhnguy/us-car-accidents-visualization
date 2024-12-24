"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import returnStateData from "../../../public/data/stateCode";

export default function BarChart() {
  const [data, setData] = useState(null);
  const svgRef = useRef();
  const tooltipRef = useRef();
  const stateData = returnStateData();

  // Fetch and update data
  const updateData = async (dataPath) => {
    try {
      const res = await fetch(`${dataPath}`);
      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      console.error(`Error fetching data for ${dataPath}:`, error);
    }
  };

  // Initial data load
  useEffect(() => {
    updateData(`/data/AccidentsByStatesFrom2016To2023.json`);
  }, []);

  useEffect(() => {
    if (!data) return;
    const dataValues = Object.values(data);
    const dataKeys = Object.keys(data);
    const largest = Math.max(...dataValues);

    const width = Math.max(window.innerWidth * 0.9, 800);
    const height = Math.max(window.innerHeight * 0.8, 600);

    const margin = { top: 20, right: 20, bottom: 60, left: 100 };

    const x = d3
      .scaleBand()
      .domain(dataKeys)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, largest])
      .range([height - margin.bottom, margin.top]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Clear the SVG before rendering
    svg.selectAll("*").remove();

    const tooltip = d3.select(tooltipRef.current);

    // Add X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("x", -3)
      .style("font-size", "12px");

    // Add Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(10))
      .style("font-size", "12px");

    // Add bars with transitions
    const bars = svg.selectAll(".bar").data(dataValues, (_, i) => dataKeys[i]);

    bars.join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "bar")
          .attr("x", (_, i) => x(dataKeys[i]))
          .attr("y", y(0)) // Start from baseline
          .attr("width", x.bandwidth())
          .attr("height", 0) // Initial height 0
          .style("fill", "#5ba2de")
          .call((enter) =>
            enter
              .transition()
              .duration(500)
              .attr("y", (d) => y(d))
              .attr("height", (d) => y(0) - y(d))
          ),
      (update) =>
        update.call((update) =>
          update
            .transition()
            .duration(750)
            .attr("x", (_, i) => x(dataKeys[i]))
            .attr("y", (d) => y(d))
            .attr("height", (d) => y(0) - y(d))
        ),
      (exit) =>
        exit.call((exit) =>
          exit
            .transition()
            .duration(750)
            .attr("y", y(0))
            .attr("height", 0)
            .remove()
        )
    );

    // Add transparent overlays for tooltip interaction
    svg
      .selectAll(".overlay")
      .data(dataValues)
      .join("rect")
      .attr("class", "overlay")
      .attr("x", (_, i) => x(dataKeys[i]))
      .attr("y", margin.top)
      .attr("width", x.bandwidth())
      .attr("height", height - margin.top - margin.bottom)
      .style("fill", "transparent")
      .on("mouseover", function (event, d) {
        const index = dataValues.indexOf(d);
        const formatNumber = d3.format(",");
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${
              stateData[dataKeys[index]]
            }</strong><br>Value: ${formatNumber(d)}`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  }, [data]);

  return (
    <div>
      <div className="flex w-full mb-4 space-x-[-2px] pl-20">
        <button
          onClick={() =>
            updateData(`/data/AccidentsByStatesFrom2016To2023.json`)
          }
          className="text-black px-4 py-2 rounded"
        >
          Total
        </button>
        {Array.from({ length: 7 }, (_, i) => 2016 + i).map((year) => (
          <button
            key={year}
            onClick={() => updateData(`/data/AccidentsByStatesIn${year}.json`)}
            className="text-black px-4 py-2 rounded"
          >
            {year}
          </button>
        ))}
        <button
          onClick={() => updateData(`/data/AccidentsByStatesIn2023.json`)}
          className="text-black px-4 py-2 rounded"
        >
          March 2023
        </button>
      </div>
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
