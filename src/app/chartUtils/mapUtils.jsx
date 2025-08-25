import * as d3 from "d3";

class mapUtils {
  constructor(stateData) {
    this.stateData = stateData;
  }

  async fetchData(path) {
    try {
      const res = await fetch(path);
      return await res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  getValue(region, isCounty, data) {
    if (isCounty) {
      return data[`${region.properties.STATEFP}${region.properties.NAME}`];
    }
    const state = this.stateData.states.find((s) => s.name === region.properties.NAME);
    return state ? data[state.short] : undefined;
  }

  renderLegend(colorScale, canvasHeight, legendRef) {
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
  }
}

export default mapUtils;
