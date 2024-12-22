import Map from "../chartsTemplate/Map";

export default function MapSection() {
  return (
    <div>
      <div
        id="data-container"
        className="flex flex-col w-screen h-screen justify-center items-center"
      >
        <Map />
      </div>
    </div>
  );
}
