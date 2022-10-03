import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2hhemlqciIsImEiOiJjbDhwM28wcHEweG0yNDFsaHY3ejlzZnJyIn0.n5ky3B93zeadobG2342Vag";

export default function MapBox({ sensor, setSensor }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(null);
  const [lng, setLng] = useState(5.0111);
  const [lat, setLat] = useState(47.2809);
  const [zoom, setZoom] = useState(11);
  const data = useRef(null);
  const sensorData = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  const get_data_by_sensor = async (id) => {
    const d = {
      Device_ID: id,
    };
    await axios.post("http://localhost:80/data_per_sensor", d).then((res) => {
      sensorData.current = res.data;
    }, sensorData.current);
  };

  useEffect(() => {
    axios.get(`http://localhost:80/device_list`).then((res) => {
      data.current = res.data.data;
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (!map.current && !data.current) return;
    // wait for map to initialize

    map.current.on("load", () => {
      map.current.loadImage(
        "https://cdn-icons-png.flaticon.com/16/0/14.png",
        (error, image) => {
          if (error) throw error;
          map.current.addImage("custom-marker", image, { sdf: true });
          map.current.addSource("my-data", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              crs: {
                type: "name",
                properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
              },
              features: data.current,
            },
          });
          map.current.addLayer({
            id: "data",
            type: "symbol",
            layout: {
              "text-field": ["get", "Device_ID"],
              "text-anchor": "left",
              "text-size": 14,
              "text-offset": [0.8, 0],
              "icon-image": "custom-marker",
            },
            source: "my-data",
            paint: {
              "icon-color": [
                "match",
                ["get", "Status"],
                "Active",
                "#367E18",
                "Not Active",
                "#FF1E1E",
                "#ccc",
              ],
            },

            filter: ["==", "$type", "Point"],
          });
        }
      );
    });
    map.current.on("click", "data", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties["Device_ID"];
      const status = e.features[0].properties["Status"];

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      if (status === "Active") {
        get_data_by_sensor(description);
        popup.current = new mapboxgl.Popup({
          className: "popup",
          closeOnClick: true,
          closeButton: false,
        })
          .setLngLat(coordinates)
          .setHTML(
            `<div >
          <div style="margin-bottom : 10px;">
          <div>Device ID : ${description}</div>
          <div>Status : <span style="color: #6366F1; font-weight: bold">${status}</span></div>
          </div>
          <div>
          <div><span style = "font-size : 12px;">Temperature : <span style = "color: #6366F1">${sensorData.current["Latest_TEMP"]}°C</span> (Avg : <span style = "color: #6366F1">${sensorData.current["Temp_AVG"]}°C</span>)</div>
          <div><span style = "font-size : 12px;">Humidity : <span style = "color: #6366F1">${sensorData.current["Latest_Hum"]} %</span> (Avg : <span style = "color: #6366F1">${sensorData.current["Hum_AVG"]} %</span>)</div>
          <div><span style = "font-size : 12px;">Pressure : <span style = "color: #6366F1">${sensorData.current["Latest_Press"]} Pa</span> (Avg : <span style = "color: #6366F1">${sensorData.current["Press_AVG"]} Pa</span>)</div>
          <div><span style = "font-size : 12px;">CO2 : <span style = "color: #6366F1">${sensorData.current["Latest_CO2"]} ppm</span> (Avg : <span style = "color: #6366F1">${sensorData.current["CO2_AVG"]}ppm</span>)</div>
          </div>
          <div>`
          )
          .addTo(map.current);
        popup.current.on("close", () => {
          sensorData.current = null;
        });
      } else {
        popup.current = new mapboxgl.Popup({
          className: "popup",
          closeOnClick: true,
          closeButton: false,
        })
          .setLngLat(coordinates)
          .setHTML(
            `<div >
          <div style="margin-bottom : 10px;">
          <div>Device ID : ${description}</div>
          <div>Status : <span style="color: #6366F1; font-weight: bold">${status}</span></div>
          </div>
          </div>`
          )
          .addTo(map.current);
      }
      popup.current.on("close", () => {
        sensorData.current = null;
      });
      //Render Graph Data
      setSensor(description);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on("mouseenter", "data", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.current.on("mouseleave", "data", () => {
      map.current.getCanvas().style.cursor = "";
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div
        ref={mapContainer}
        style={{ height: "800px", borderRadius: "5px", width: "100%" }}
      />
    </div>
  );
}
