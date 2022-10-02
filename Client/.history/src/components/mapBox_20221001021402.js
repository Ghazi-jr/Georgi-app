import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2hhemlqciIsImEiOiJjbDhwM28wcHEweG0yNDFsaHY3ejlzZnJyIn0.n5ky3B93zeadobG2342Vag";

export default function MapBox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(5.046104146);
  const [lat, setLat] = useState(47.23921582);
  const [zoom, setZoom] = useState(5);

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
        map.current.on('load', () => {
            map.addSource('my-data', {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-77.0323, 38.9131]
                    },
                    "properties": {
                        "title": "Mapbox DC",
                        "marker-symbol": "monument"
                    }
                }
            });
    }});
    

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
