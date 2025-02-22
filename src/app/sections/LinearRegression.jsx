import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LinearRegression = () => {
	const d3Container = useRef(null);

	useEffect(() => {
		fetch('/data/predictions_data.json')
			.then(response => response.json())
			.then(data => {
				const margins = { top: 20, right: 20, bottom: 60, left: 100 };
				const totalWidth = Math.max(window.innerWidth * 0.9, 800);
				const totalHeight = Math.max(window.innerHeight * 0.8, 600);
				const width = totalWidth - margins.left - margins.right;
				const height = totalHeight - margins.top - margins.bottom;
				
				const parseDate = d3.timeParse("%Y-%m");
				const formatDate = d3.timeFormat("%Y-%m");
				const dates = data.dates.map(d => parseDate(d));
				const actualValues = data.actual_values;
				const predictedValues = data.predicted_values;
				const slope = data.slope; 
				const bias = data.offset;    

				// Create scales using dates and values.
				const xScale = d3.scaleTime()
					.domain(d3.extent(dates))
					.range([0, width]);

				const allY = actualValues.concat(predictedValues);
				const yScale = d3.scaleLinear()
					.domain([0, d3.max(allY)])
					.range([height, 0]);

				// Clear previous svg if it exists.
				d3.select(d3Container.current).select("svg").remove();
				// Remove any previous tooltip.
				d3.select(d3Container.current).select(".tooltip").remove();

				// Create tooltip element
				const tooltip = d3.select(d3Container.current)
					.append("div")
					.attr("class", "tooltip")
					.style("position", "absolute")
					.style("opacity", 0)
					.style("background", "white")
					.style("border", "1px solid #888")
					.style("padding", "8px")
					.style("border-radius", "4px")
					.style("pointer-events", "none");

				const svg = d3.select(d3Container.current)
					.append("svg")
					.attr("width", totalWidth)
					.attr("height", totalHeight)
					.append("g")
					.attr("transform", `translate(${margins.left},${margins.top})`);

				// X and Y Axes.
				svg.append("g")
					.attr("transform", `translate(0, ${height})`)
					.call(d3.axisBottom(xScale));

				svg.append("g")
					.call(d3.axisLeft(yScale));

				// Plot scatter points for actual values with tooltip events.
				svg.selectAll(".dot")
					.data(actualValues)
					.enter()
					.append("circle")
					.attr("class", "dot")
					.attr("cx", (d, i) => xScale(dates[i]))
					.attr("cy", d => yScale(d))
					.attr("r", 6)
					.attr("fill", "steelblue")
					.on("mouseover", (event, d, i) => {
						const index = svg.selectAll(".dot").nodes().indexOf(event.target);
						tooltip.transition().duration(200).style("opacity", 1);
						tooltip.html(`Date: ${formatDate(dates[index])}<br/>Actual: ${d}`);
					})
					.on("mousemove", (event) => {
						tooltip.style("left", `${event.pageX + 5}px`)
							   .style("top", `${event.pageY - 20}px`);
					})
					.on("mouseout", () => {
						tooltip.transition().duration(200).style("opacity", 0);
					});

				// Plot regression line using predicted values.
				const line = d3.line()
					.x((d, i) => xScale(dates[i]))
					.y(d => yScale(d));

				svg.append("path")
					.datum(predictedValues)
					.attr("fill", "none")
					.attr("stroke", "orange")
					.attr("stroke-width", 2)
					.attr("d", line);

				// Add an overlay for mouse interaction on the entire chart area.
				svg.append("rect")
					.attr("class", "overlay")
					.attr("width", width)
					.attr("height", height)
					.style("fill", "none")
					.style("pointer-events", "all")
					.on("mousemove", function(event) {
						const [mx] = d3.pointer(event);
						const x0 = xScale.invert(mx);
						// Find index using bisector.
						const bisect = d3.bisector(d => d).left;
						const index = bisect(dates, x0);
						const predVal = predictedValues[index];
						tooltip.transition().duration(200).style("opacity", 1);
						tooltip.html(`Date: ${formatDate(dates[index])}<br/>Predicted: ${predVal.toFixed(2)}`)
							   .style("left", `${event.pageX + 5}px`)
							   .style("top", `${event.pageY - 20}px`);
					})
					.on("mouseout", () => {
						tooltip.transition().duration(200).style("opacity", 0);
					});
			});
	}, []);

	return (
		<div ref={d3Container} id="data-container" className="flex flex-col w-screen items-center">
			{/* D3 chart will be rendered here */}
		</div>
	);
};

export default LinearRegression;
