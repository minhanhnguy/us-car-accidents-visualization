"use client";

import "./globals.css";
import Head from "next/head";
import { useEffect } from "react";
import MapSection from "./sections/MapSection.jsx";
import BarChartSection from "./sections/BarChartSection.jsx";
import LinearRegression from "./sections/LinearRegression";

export default function Home() {
  useEffect(() => {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", "#ffffff");

    document.documentElement.style.setProperty("--bg-color", "#ffffff");
    document.documentElement.style.setProperty("--text-color", "#000000");
  }, []);

  return (
    <div>
      <Head>
        <title>Insights and Trends in U.S. Car Accidents</title>
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="header">
        <h1>Insights and Trends in U.S. Car Accidents: 2016 to March 2023</h1>
      </div>
      <div className="reportContainer">
        <p className="reportContent">
          On November 29, 2024, just days after Thanksgiving, I was involved in a
          devastating car accident while driving back to my dorm. The collision
          left everyone involved injured. My friends suffered severe injuries,
          including broken bones and one requiring emergency stomach surgery.
          I was fortunate to escape with only two fractured fingers and minor
          scrapes. Tragically, the other driver, who wasn’t wearing a seatbelt,
          was ejected through the windshield and succumbed to their injuries at
          the scene. Five days later, shaken by this experience, I began this
          report to analyze U.S. car accident trends from 2016 to March 2023.
          My goal is twofold: to raise public awareness about the severity of
          car accidents and to reflect on the profound responsibility every
          driver holds.
        </p>
      </div>
      <MapSection />
      <div className="reportContainer">
        <p className="reportContent" style={{ marginTop: "15px" }}>
          The first section of this analysis features a Choropleth Map of the
          United States, visualizing car accident data from 2016 to March 2023.
          A logarithmic color scale highlights the wide range of accident
          frequencies across states. Over this seven-year period, the southern
          U.S. emerged as a hotspot, with California (1,741,433), Florida
          (880,192), and Texas (582,837) recording the highest accident totals.
          California’s lead likely stems from its large population, extensive
          road network, and high vehicle density. Conversely, northeastern
          states like Vermont, New Hampshire, and Maine reported far fewer
          incidents, with totals between 1,000 and 10,000. These states’ smaller
          populations, fewer highways, and reduced urban congestion likely
          contribute to their lower rates. South Dakota stood out with the
          fewest accidents nationwide, reporting just 289 incidents—a striking
          contrast to national trends.
        </p>
        <p className="reportContent">
          Zooming into the county level, California and Florida show accidents
          spread widely across their regions, with Los Angeles County (526,851)
          and Miami-Dade County (251,601) topping the list. In Texas, however,
          accidents cluster in specific urban centers, notably Harris County
          (180,905), Dallas County (155,733), and Travis County (107,881). This
          distribution points to a clear link between accident rates and
          population density, as densely populated urban areas consistently
          report higher figures.
        </p>
      </div>
      <hr
        style={{
          marginTop: "20px",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      <BarChartSection />
      <div style={{ height: "20px" }} />
      <LinearRegression />
      <div className="reportContainer">
        <p className="reportContent" style={{ marginTop: "15px" }}>
          The final section presents a scatter plot tracking U.S. car accidents
          from 2017 to 2023, with years on the x-axis and accident counts (0 to
          180,000) on the y-axis. Blue data points reveal a steady climb, from
          under 40,000 accidents in 2017 to over 140,000 by 2023. An orange
          linear regression line, with a slope of 0.756, reinforces this upward
          trend, suggesting a strong positive correlation between time and
          accident frequency. While the slope indicates a significant annual
          increase—potentially around 20,000 additional accidents per year,
          depending on data scaling—this rise isn’t uniform. Yearly
          fluctuations appear as outliers above and below the trend line, yet
          the overall pattern is undeniable: accidents are becoming more
          frequent. Possible drivers of this trend include growing traffic
          volumes, population increases, or shifts in road safety practices,
          all of which merit deeper exploration.
        </p>
      </div>
      <div style={{ height: "15px" }} />
    </div>
  );
}