import Map, { GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function MapBox() {
  return (
    <div>
      <Map
        mapboxAccessToken="sk.eyJ1IjoiZ2hhemlqciIsImEiOiJjbDhwM3FkZGUwaG9iM3BydTZ3cHUxbXZwIn0.9TQa5Xp0z26b9YEln-o2kQ"
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
      </Map>
    </div>
  );
}
export default MapBox;
