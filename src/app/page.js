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
      <div class="report-container">
        <p class="report-content">On November 29, 2024, following Thanksgiving dinner, I was involved in a car accident while returning to my dormitory. The collision resulted in injuries to all parties involved. My friends sustained various injuries, including broken bones, and one required stomach surgery. I was fortunate to escape with two fractured fingers and a few minor injuries. Tragically, the other driver succumbed to their injuries at the scene. This profound experience prompted me, five days later, to embark on writing this report to analyze trends in U.S. car accidents from 2016 to March 2023.</p>
      </div>
      <MapSection />
      <BarChartSection />
    </div>
  );
}
