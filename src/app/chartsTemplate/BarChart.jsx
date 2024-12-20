"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (data) {
      // Convert data to values and find the largest
      const dataValues = Object.values(data);
      const dataKeys = Object.keys(data);
      const largest = Math.max(...dataValues);

      // Set chart dimensions
      const width = screen.width * 0.8;
      const height = screen.height * 0.8;

      // Set chart margin and padding
      const marginTop = 20,
        marginBottom = 40,
        marginLeft = 50,
        marginRight = 20;

      // Declare scales.
      const x = d3
        .scaleBand()
        .domain(dataKeys)
        .range([marginLeft, width - marginRight])
        .padding(0.05);

      const y = d3
        .scaleLinear()
        .domain([0, largest])
        .range([height - marginBottom, marginTop]);

      // Select the SVG element
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      // Clear previous content (important for rerenders)
      svg.selectAll("*").remove();

      // Draw the x-axis
      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("x", -3)
        .style("text-anchor", "end");

      // Draw the y-axis
      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y));

      // Bind data and create bars
      svg
        .selectAll("rect")
        .data(dataValues)
        .join("rect")
        .attr("x", (_, i) => x(dataKeys[i]))
        .attr("y", (d) => y(d))
        .attr("height", (d) => height - marginBottom - y(d)) // Corrected height calculation
        .attr("width", x.bandwidth())
        .style("fill", "steelblue");
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
