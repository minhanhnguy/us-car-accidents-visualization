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
      <div className="header">
        <h1>
          Insight And Trends In The US Car Accidents From 2016 to March 2023
        </h1>
      </div>
      <div className="reportContainer">
        <p className="reportContent">
          On November 29, 2024, following Thanksgiving dinner, I was involved in
          a car accident while returning to my dorm. The collision resulted in
          injuries to all people involved. My friends sustained various
          injuries, including broken bones, and one required stomach surgery. I
          was fortunate to escape with two fractured fingers and a few minor
          injuries. However, the other driver didn't wear seatbelt, flew out of
          the front window of his car and finally succumbed to their injuries at
          the scene. This deeply impactful experience prompted me, five days
          later, to write this report analyzing trends in U.S. car accidents
          from 2016 to March 2023, in an effort to raise awareness about the
          severity of car incidents in general.
        </p>
      </div>
      <MapSection />
      <BarChartSection />
    </div>
  );
}
