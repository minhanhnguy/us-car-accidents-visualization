"use client";

import "./globals.css";
import Head from "next/head";
import BarChartSection from "./sections/BarChartSection";
import MapSection from "./sections/MapSection";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Insight And Trends In The US Car Accidents</title>
      </Head>
      <MapSection />
      <BarChartSection />
    </div>
  );
}
