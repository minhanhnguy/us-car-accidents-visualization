"use client";

import "./globals.css";
import Head from "next/head";
import MapSection from "./sections/MapSection.jsx";
import BarChartSection from "./sections/BarChartSection.jsx";

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
          the scene. This deeply impactful experience prompted me to write this
          report analyzing trends five days later about U.S. car accidents from
          2016 to March 2023, in an effort to raise awareness about the severity
          of car incidents for the public, and also to remind myself about how
          dangerous and impactful a driver can become.
        </p>
      </div>
      <MapSection />
      <div className="reportContainer">
        <p className="reportContent" style={{ marginTop: "15px" }}>
          In the first part of the analysis, a Choropleth Map of the United
          States is used to visually represent car accidents from 2016 to March
          2023. The map employs a logarithmic color-coding scale to illustrate
          the significant variations in accident numbers across the country.
          Over the span of more than seven years, the majority of car accidents
          in the United States were concentrated in southern regions, with
          California (1,741,433), Florida (880,192), and Texas (582,837)
          reporting the highest figures. California leads as the state with the
          most accidents, likely due to its large population, extensive road
          network, and high vehicle density. In contrast, northeastern states
          such as Vermont, New Hampshire, and Maine reported significantly fewer
          accidents, with totals ranging between 1,000 and 10,000 during the
          same period. These states are characterized by smaller populations,
          fewer major highways, and less urban congestion, factors that likely
          contribute to their lower accident rates. South Dakota recorded the
          lowest number of accidents nationwide, with just 289 incidents—a
          particularly notable statistic given the nationwide trends.
        </p>
        <p className="reportContent">
          On the county scale, accidents in California and Florida are broadly
          distributed across counties, with Los Angeles (526,851) and Miami-Dade
          (251,601) recording the highest numbers. In contrast, Texas
          demonstrates a more localized concentration of accidents, primarily in
          Harris (180,905), Dallas (155,733), and Travis (107,881). This pattern
          suggests a strong correlation between the number of car accidents and
          population density, as urbanized and populous areas tend to experience
          higher accident rates.
        </p>
      </div>
      <hr
        style={{
          marginTop: "20px",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      ></hr>
      <BarChartSection />
    </div>
  );
}
