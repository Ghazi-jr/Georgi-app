import React from "react";
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
        display: true,
        align: "end",
      },
    },
    y1: {
      type: "linear",
      display: "auto",
      position: "right",
      title: {
        text: "CO2 (ppm)",
        display: true,
        align: "end",
      },

      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
    y2: {
      type: "linear",
      display: "auto",
      position: "left",
      title: {
        text: "Humidity (%)",
        display: true,
        align: "end",
      },

      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
    y3: {
      type: "linear",
      display: "auto",
      position: "right",
      title: {
        text: "Pressure (Pa)",
        display: true,
        align: "end",
      },

      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
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

function Chart({ sensor, setSensor, data }) {
  return <>{<Line options={options} data={data} />}</>;
}

export default Chart;
