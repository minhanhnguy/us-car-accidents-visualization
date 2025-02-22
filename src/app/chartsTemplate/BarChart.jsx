"use client";

import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import returnStateData from "../../../public/data/stateCode.js";

export default function BarChart() {
  const [chartData, setChartData] = useState(null);
  const svgRef = useRef();
  const tooltipRef = useRef();
  const stateMetadata = returnStateData();

  const fetchChartData = async (dataPath) => {
    try {
      const response = await fetch(dataPath);
      const jsonData = await response.json();
      setChartData(jsonData);
    } catch (error) {
      console.error(`Error fetching data from ${dataPath}:`, error);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchChartData(`/data/AccidentsByStatesFrom2016To2023.json`);
  }, []);

  useEffect(() => {
    if (!chartData) return;

    const stateNames = Object.keys(chartData);
    const accidentCounts = Object.values(chartData);
    const maxAccidentCount = Math.max(...accidentCounts);

    const svgWidth = Math.max(window.innerWidth * 0.9, 800);
    const svgHeight = Math.max(window.innerHeight * 0.8, 600);

    const margins = { top: 20, right: 20, bottom: 60, left: 100 };

    const xScale = d3
      .scaleBand()
      .domain(stateNames)
      .range([margins.left, svgWidth - margins.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxAccidentCount])
      .range([svgHeight - margins.bottom, margins.top]);

    const svg = d3
      .select(svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    svg.selectAll("*").remove();

    const tooltip = d3.select(tooltipRef.current).style("opacity", 0);

    svg
      .append("g")
      .attr("transform", `translate(0,${svgHeight - margins.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("x", -3)
      .style("font-size", "12px");

    // Add Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margins.left},0)`)
      .call(d3.axisLeft(yScale).ticks(10))
      .style("font-size", "12px");

    // Add bars with transitions
    const bars = svg
      .selectAll(".bar")
      .data(accidentCounts, (_, index) => stateNames[index]);

    bars.join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "bar")
          .attr("x", (_, index) => xScale(stateNames[index]))
          .attr("y", yScale(0)) 
          .attr("width", xScale.bandwidth())
          .attr("height", 0) 
          .style("fill", "#5ba2de")
          .call((enter) =>
            enter
              .transition()
              .duration(500)
              .attr("y", (d) => yScale(d))
              .attr("height", (d) => yScale(0) - yScale(d))
          ),
      (update) =>
        update.call((update) =>
          update
            .transition()
            .duration(750)
            .attr("x", (_, index) => xScale(stateNames[index]))
            .attr("y", (d) => yScale(d))
            .attr("height", (d) => yScale(0) - yScale(d))
        ),
      (exit) =>
        exit.call((exit) =>
          exit
            .transition()
            .duration(750)
            .attr("y", yScale(0))
            .attr("height", 0)
            .remove()
        )
    );

    svg
      .selectAll(".overlay")
      .data(accidentCounts)
      .join("rect")
      .attr("class", "overlay")
      .attr("x", (_, index) => xScale(stateNames[index]))
      .attr("y", margins.top)
      .attr("width", xScale.bandwidth())
      .attr("height", svgHeight - margins.top - margins.bottom)
      .style("fill", "transparent")
      .on("mouseover", function (_, d) {
        const index = accidentCounts.indexOf(d);
        const formattedNumber = d3.format(",")(d);
        const stateName = stateMetadata.states.find(
          (state) => state.short === stateNames[index]
        )?.name;

        tooltip.transition().duration(200).style("opacity", 1);

        tooltip
          .html(
            `<strong>${stateName || stateNames[index]}</strong><br>Accidents: ${formattedNumber}`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 5}px`) 
          .style("top", `${event.pageY - 20}px`); 
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  }, [chartData]);

  return (
    <div>
      <div className="flex w-full">
        <button
          onClick={() => fetchChartData(`/data/AccidentsByStatesFrom2016To2023.json`)}
        >
          Total
        </button>
        {Array.from({ length: 7 }, (_, i) => 2016 + i).map((year) => (
          <button
            key={year}
            onClick={() => fetchChartData(`/data/AccidentsByStatesIn${year}.json`)}
          >
            {year}
          </button>
        ))}
        <button
          onClick={() => fetchChartData(`/data/AccidentsByStatesIn2023.json`)}
        >
          March 2023
        </button>
      </div>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        className="tooltip"
      ></div>
    </div>
  );
}