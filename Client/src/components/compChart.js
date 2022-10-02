import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  elements: {
    point: {
      borderWidth: 0,
      radius: 0,
      backgroundColor: "rgba(0,0,0,0)",
    },
  },

  scales: {
    y: {
      type: "linear",
      display: "auto",
      position: "left",
      title: {
        text: "Temperature (°C)",
        display: false,
        align: "end",
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },

    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

function CompChart({ selected }) {
  const [compData, setCompData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const d = {
        type: selected.name,
      };
      await axios
        .post("http://localhost:80/comparative_graph", d)
        .then((res) => {
          setCompData(res.data);
        });
    }
    fetchData();
  }, [selected]);
  let labels = compData["time"];
  //Could be done dynamically
  const ids = ["13010", "13012", "13014", "13016", "13018"];
  const colors = ["#6366F1", "#E80F88", "#94B49F", "#FFC23C", "#562B08"];
  let data = {
    labels,
    datasets: ids.map((id, index) => ({
      label: id,
      data: compData[id],
      borderColor: colors[index],
      backgroundColor: colors[index],
      yAxisID: "y",
    })),
  };
  return <>{<Line options={options} data={data} />}</>;
}

export default CompChart;
