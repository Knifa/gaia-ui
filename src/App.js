import './App.css';
import 'leaflet/dist/leaflet.css';

import { useRef, Fragment } from 'react';
import {
  MapContainer,
  TileLayer,
  Rectangle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L, { transformation } from 'leaflet';

const TILE_WIDTH = 8;
const TILE_WIDTH_2 = TILE_WIDTH / 2;
const TILES = 16;
const TILES_2 = TILES / 2;

function MyGridRectangle(props) {
  const map = useMap();
  const rectRef = useRef();

  const pathOptions = {
    color: 'black',
    opacity: 0.25,
    weight: 2,
    fill: true,
    fillOpacity: 0,
  };

  const eventHandlers = {
    mouseover: () => {
      console.log(rectRef);
      rectRef.current.setStyle({
        ...pathOptions,
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: 'white',
      });
    },
    mouseout: () => {
      rectRef.current.setStyle(pathOptions);
    },
  };

  const origin = map.project(map.getCenter());

  const corner1 = origin
    .subtract([TILE_WIDTH_2, TILE_WIDTH_2])
    .add(props.offsetPoint);
  const corner2 = origin
    .add([TILE_WIDTH_2, TILE_WIDTH_2])
    .add(props.offsetPoint);

  const originLatLong = map.unproject(corner1);
  const cornerLatLong = map.unproject(corner2);

  return (
    <Rectangle
      ref={rectRef}
      bounds={[originLatLong, cornerLatLong]}
      pathOptions={pathOptions}
      eventHandlers={eventHandlers}
    />
  );
}

function MyGridLayer() {
  const map = useMap();

  const rects = [];

  for (let y = -TILES_2; y < TILES_2; y++) {
    for (let x = -TILES_2; x < TILES_2; x++) {
      const offsetPoint = new L.Point(x * TILE_WIDTH, y * TILE_WIDTH);

      rects.push(<MyGridRectangle offsetPoint={offsetPoint} />);
    }
  }

  return <Fragment>{rects}</Fragment>;
}

function App() {
  return (
    <div className="App">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        className="MapContainer"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MyGridLayer />
      </MapContainer>
    </div>
  );
}

export default App;
