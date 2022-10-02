import { Disclosure } from "@headlessui/react";
import "./App.css";
import MapBox from "./components/mapBox";
import Chart from "./components/chart";
import CompChart from "./components/compChart";
import SelectType from "./components/selectType";
import logo from "./logo.png";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [sensor, setSensor] = useState(13012);
  // let data;
  const [sensorData, setSensorData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const d = {
        Device_ID: sensor,
      };
      await axios
        .post("http://localhost:80/graph_data_by_sensor", d)
        .then((res) => {
          setSensorData(res.data);
        });
      console.log(sensorData);
    }
    fetchData();
  }, [sensor]);
  let labels = sensorData["Time"];
  let data = {
    labels,
    datasets: [
      {
        label: "Temperature",
        data: sensorData["Temp"],
        borderColor: "#6366F1",
        backgroundColor: "#6366F1",
        yAxisID: "y",
      },
      {
        label: "Humidity",
        data: sensorData["Hum"],
        borderColor: "#E80F88",
        backgroundColor: "#E80F88",
        yAxisID: "y2",
      },
      {
        label: "CO2",
        data: sensorData["CO2"],
        borderColor: "#94B49F",
        backgroundColor: "#94B49F",
        yAxisID: "y1",
      },
      {
        label: "Pressure",
        data: sensorData["Press"],
        borderColor: "#FFC23C",
        backgroundColor: "#FFC23C",
        yAxisID: "y3",
      },
    ],
  };

  const [selected, setSelected] = useState({
    id: 1,
    name: "Temperature",
    unavailable: false,
  });
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto  px-1 sm:px-3 lg:px-5">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img className="h-48 w-48" src={logo} alt="Your Company" />
                </div>
                {/* <div className="flex-shrink-0">
                  
                </div> */}
              </div>
            </div>
          </div>
        </Disclosure>
        <header className="bg-white shadow">
          <div className="mx-auto  py-6 px-4 sm:px-6 lg:px-8">
            <h1
              className="text-3xl font-bold tracking-tight "
              style={{ color: "#6366F1" }}
            >
              <span className="text-gray-800">Sensors</span> Data Analysis
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto  py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 divide-x px-4 py-6 sm:px-0 space-x-6">
              <div className="h-full ">
                <MapBox sensor={sensor} setSensor={setSensor} />
              </div>
              <div>
                <div>
                  <div className="my-2 mx-5">
                    <span
                      className=" sm:text-sm md:text-md font-bold tracking-tight "
                      style={{ color: "#6366F1" }}
                    >
                      Data Graph Of Sensor :{" "}
                      <span className="text-gray-600">{sensor}</span>
                    </span>
                  </div>
                  <Chart sensor={sensor} setSensor={setSensor} data={data} />
                </div>
                <div>
                  <div className="my-2 mx-5 flex flex-row justify-between items-center ">
                    <div>
                      <span
                        className=" sm:text-sm md:text-md font-bold tracking-tight "
                        style={{ color: "#6366F1" }}
                      >
                        Comparative Graph :
                      </span>
                    </div>
                    <div className=" flex flex-row items-center gap-5 ">
                      <div>
                        <span className="sm:text-sm md:text-md tracking-tight font-bold text-gray-600">
                          Select Data{" "}
                          <span style={{ color: "#6366F1" }}>Type :</span>
                        </span>
                      </div>
                      <SelectType
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </div>
                  </div>
                  <CompChart data={data} selected={selected} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
