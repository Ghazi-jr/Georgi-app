// If this helps, don't forget to upvote so others can see
// Uncomment line 20 and insert your API key if you don't want the "For development purposes only" message

import React from "react";
import { GoogleMap } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 31.968599,
  lng: -99.90181,
};

export default function GoogleMaps() {
  const { isLoaded, loadError } = useLoadScript({
    // Uncomment the line below and add your API key
    // googleMapsApiKey: '<Your API Key>',
  });

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={11}
      center={center}
    />
  );
}
