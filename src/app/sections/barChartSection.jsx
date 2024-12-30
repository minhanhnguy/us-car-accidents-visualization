import BarChart from "../chartsTemplate/BarChart";

export default function BarChartSection() {
  return (
    <div>
      <div
        id="data-container"
        className="flex flex-col w-screen items-center"
      >
        <BarChart />
      </div>
    </div>
  );
}
