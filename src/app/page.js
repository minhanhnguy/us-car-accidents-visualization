"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import * as d3 from "d3";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/data/AccidentsByStatesFrom2016To2023.json"); // Public folder access
      const jsonData = await res.json();
      setData(jsonData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);

      const dataArray = Object.entries(data);
      const container = d3.select("#data-container");
      container.selectAll("p").remove(); // Clear any previous content

      // Bind data and append elements
      container
        .selectAll("p")
        .data(dataArray)
        .enter()
        .append("p")
        .text(([state, accidents]) => `${state}: ${accidents}`);
    }
  }, [data]);

  return (
    <div>
      <Head>
        <title>Insight And Trends In The US Car Accidents</title>
      </Head>
      <p>Hello!!!</p>
      <div id="data-container"></div>
    </div>
  );
}
