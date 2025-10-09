import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

const customIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232ecc71'%3E%3Cpath d='M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function AddMarkerOnClick({ setMarkers }) {
  useMapEvents({
    click(e) {
      setMarkers((prev) => [...prev, e.latlng]);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }) {
  const map = useMap();
  if (lat && lng) {
    map.setView([lat, lng], 20);
  }
  return null;
}

const Carte = () => {
  const [markers, setMarkers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      search
    )}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setMarkers((prev) => [...prev, newPos]);
        setSearchResult(newPos);
      } else {
        alert("Adresse non trouvée !");
      }
    } catch (err) {
      console.error("Erreur de recherche:", err);
    }
  };

  return (
    <div className="map-wrapper">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher une adresse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">OK</button>
      </form>

      <MapContainer center={[45.52, -73.76]} zoom={13} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddMarkerOnClick setMarkers={setMarkers} />

        {markers.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={customIcon}></Marker>
        ))}

        {searchResult && (
          <RecenterMap lat={searchResult.lat} lng={searchResult.lng} />
        )}
      </MapContainer>
    </div>
  );
};

export default Carte;
