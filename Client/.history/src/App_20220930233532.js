import "./App.css";
import { Map, GoogleApiWrapper } from "google-maps-react";

function App() {
  return (
    <div className="App">
      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      <Map google={} style = {{width: '100%', height: '80%'}} zoom={10} initialCenter = {{lat :5.046104146 , lng : 47.23921582}} />
    </div>
  );
}

export default App;
