import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import API_BASE_URL from "../../config/api.js";

const customIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232ecc71'%3E%3Cpath d='M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const demandeIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e74c3c'%3E%3Cpath d='M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 17, {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25,
      });

      const mapPane = map.getPanes().mapPane;
      mapPane.style.transition = "transform 1s ease";
      mapPane.style.transform = "rotate(1.5deg)";

      setTimeout(() => {
        mapPane.style.transform = "rotate(0deg)";
      }, 1000);
    }
  }, [lat, lng, map]);

  return null;
}

const Carte = () => {
  const [markers, setMarkers] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/demandes`);
      const data = await response.json();

      if (data.success) {
        const demandesAvecCoords = await Promise.all(
          data.demandes.map(async (demande) => {
            if (demande.adresse) {
              const coords = await geocodeAddress(demande.adresse);
              return { ...demande, coordinates: coords };
            }
            return demande;
          })
        );
        setDemandes(demandesAvecCoords.filter((d) => d.coordinates));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error("Erreur de géocodage:", error);
    }
    return null;
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "en_attente":
        return "#f39c12";
      case "acceptee":
        return "#3498db";
      case "en_cours":
        return "#9b59b6";
      case "terminee":
        return "#27ae60";
      default:
        return "#95a5a6";
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

      {loading && (
        <div className="loading-overlay">
          <p>Chargement des demandes...</p>
        </div>
      )}

      <MapContainer
        center={[45.52, -73.76]}
        zoom={13}
        className="map-container"
      >
        <TileLayer
  attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
/>


        {/* Marqueurs de recherche (pas d'ajout au clic) */}
        {markers.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={customIcon}></Marker>
        ))}

        {/* Marqueurs des demandes */}
        {demandes.map((demande) => (
          <Marker
            key={demande.id}
            position={[demande.coordinates.lat, demande.coordinates.lng]}
            icon={demandeIcon}
          >
            <Popup>
              <div className="demande-popup">
                <h3>Demande #{demande.id}</h3>
                <div className="demande-details">
                  <p>
                    <strong>Catégorie:</strong> {demande.categorie}
                  </p>
                  <p>
                    <strong>Client:</strong> {demande.client_nom}
                  </p>
                  <p>
                    <strong>Description:</strong> {demande.description}
                  </p>
                  <p>
                    <strong>Adresse:</strong> {demande.adresse}
                  </p>
                  <p>
                    <strong>Code postal:</strong> {demande.code_postal}
                  </p>
                  <p>
                    <strong>Date/Heure:</strong>{" "}
                    {formatDate(demande.date_heure)}
                  </p>
                  <p>
                    <strong>Durée estimée:</strong> {demande.duree_estimee} min
                  </p>
                  <p>
                    <strong>Statut:</strong>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(demande.statut),
                      }}
                    >
                      {demande.statut.replace("_", " ")}
                    </span>
                  </p>
                  {demande.prestataire_nom && (
                    <p>
                      <strong>Prestataire:</strong> {demande.prestataire_nom}
                    </p>
                  )}
                  <p>
                    <strong>Créée le:</strong>{" "}
                    {formatDate(demande.date_creation)}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {searchResult && (
          <RecenterMap lat={searchResult.lat} lng={searchResult.lng} />
        )}
      </MapContainer>
    </div>
  );
};

export default Carte;
