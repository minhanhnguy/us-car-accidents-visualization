"use client";
import Head from "next/head";
import "./globals.css";
import { useState, useEffect } from "react";
import BarChart from "./chartsTemplate/BarChart";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/data/AccidentsByStatesFrom2016To2023.json");
      const jsonData = await res.json();
      setData(jsonData);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Head>
        <title>Insight And Trends In The US Car Accidents</title>
      </Head>
      <div
        id="data-container"
        className="flex w-screen h-screen justify-center items-center"
      >
        <BarChart data={data} />
      </div>
    </div>
  );
}
