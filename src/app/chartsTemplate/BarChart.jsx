"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BarChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (data) {
      // Convert data to values and find the largest
      const dataValue = Object.values(data);
      const largest = Math.max(...dataValue);

      // Set chart dimensions
      const width = 500;
      const height = 300;
      const barPadding = 1;

      // Select the SVG element
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "black");

      // Bind data and create bars
      svg
        .selectAll("rect")
        .data(dataValue)
        .join("rect")
        .attr("y", (d) => height - (d / largest) * height * 0.99)
        .attr("height", (d) => (d / largest) * height * 0.99)
        .attr("width", width / dataValue.length - barPadding)
        .attr("x", (_, i) => (width / dataValue.length) * i)
        .style("fill", "white");
    }
  }, [data]);

  return <svg ref={svgRef}></svg>;
}
