import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2hhemlqciIsImEiOiJjbDhwM28wcHEweG0yNDFsaHY3ejlzZnJyIn0.n5ky3B93zeadobG2342Vag";

export default function MapBox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(5.046104146);
  const [lat, setLat] = useState(47.23921582);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("load", () => {
      map.current.addSource("my-data", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          crs: {
            type: "name",
            properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
          },
          features: [
            {
              type: "Feature",
              properties: {
                Device_ID: 13010,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.046104146, 47.23921582],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13011,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.033761963, 47.32524852],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13012,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.051834028, 47.27257554],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13013,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.053558851, 47.28438358],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13014,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.03001386, 47.29986124],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13015,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.051030176, 47.24271594],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13016,
                Start: "01/01/2022",
                End: "30/04/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [4.993090012, 47.30114935],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13016,
                Start: "01/05/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [4.993356696, 47.27759682],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13017,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.012264553, 47.25974511],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13018,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.04527377, 47.25805412],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13019,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [5.007905783, 47.25164672],
              },
            },
            {
              type: "Feature",
              properties: {
                Device_ID: 13020,
                Start: "01/01/2022",
                End: "16/06/2022",
              },
              geometry: {
                type: "Point",
                coordinates: [4.98967875, 47.27088684],
              },
            },
          ],
        },
      });

      map.current.addLayer({
        id: "data",
        type: "circle",
        source: "my-data",
        paint: {
          "circle-radius": 8,
          "circle-color": "#6366F1",
        },
        filter: ["==", "$type", "Point"],
      });
    });
    map.current.on("click", "data", (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties["Device_ID"];

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({ className: "popup" })
        .setLngLat(coordinates)
        .setHTML("Sensor ID : " + description)
        .addTo(map.current);
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
        style={{ height: "500px", borderRadius: "5px", width: "100%" }}
      />
    </div>
  );
}
