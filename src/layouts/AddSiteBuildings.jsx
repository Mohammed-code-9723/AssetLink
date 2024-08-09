import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, useMapEvents,Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Switch } from '@mui/joy';
import Typography from '@mui/joy/Typography';

// Convert the icon to a data URL
const createCustomIcon = () => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#04c179">
      <path d="M12 2C8.14 2 5 5.14 5 9c0 4.3 7 13 7 13s7-8.7 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z"/>
    </svg>`;
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  return new L.Icon({
    iconUrl: url,
    iconSize: [40, 40],
    iconAnchor: [12, 24], // adjust this as needed
    popupAnchor: [0, -24], // adjust this as needed
  });
};

function LocationMarker({ addLocation }) {
  useMapEvents({
    contextmenu(e) {
      addLocation([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function SearchResults({ searchResults, handleSearchResultClick }) {
  return (
    <ul>
      {searchResults.map((result, idx) => (
        <li key={idx} onClick={() => handleSearchResultClick(result)}>
          {result.display_name}
        </li>
      ))}
    </ul>
  );
}

function MoveToLocation({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 17);
    }
  }, [lat, lon, map]);

  return null;
}

export default function AddSiteBuildings() {
  const [locations, setLocations] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [customIcon, setCustomIcon] = useState(null);
  const [checked, setChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [targetLocation, setTargetLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const icon = createCustomIcon();
    setCustomIcon(icon);
  }, []);

  const addLocation = async (location) => {
    const address = await getAddress(location);
    setLocations((prevLocations) => [...prevLocations, { coords: location, address }]);
    setPolygonCoords((prevCoords) => [...prevCoords, location]);
  };

  const getAddress = async ([lat, lng]) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json'
        }
      });
      return response.data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Unknown address';
    }
  };

  const searchPlace = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: searchQuery,
          format: 'json',
          addressdetails: 1,
          limit: 5,
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for place:', error);
    }
  };

  const handleSearchResultClick = (result) => {
    const location = [parseFloat(result.lat), parseFloat(result.lon)];
    addLocation(location);
    setSearchResults([]);
    setSearchQuery("");
    setTargetLocation(location);
  };

  const handleLocationClick = (location) => {
    setTargetLocation(location.coords);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          addLocation(location);
          setUserLocation(location);
          console.log('User location:', location);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <div style={{ flex: 1, height: '80vh' }}>
        <MapContainer center={[33.908089, -5.578308]} zoom={17} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker addLocation={addLocation} />
          {locations.map((loc, idx) => (
            <Marker key={idx} position={loc.coords} icon={customIcon}>
              <Popup>
                Location: {loc.coords[0].toFixed(6)}, {loc.coords[1].toFixed(6)}<br />
                Address: {loc.address}
              </Popup>
            </Marker>
          ))}
          {(checked && polygonCoords.length > 2) && (
            <Polygon positions={polygonCoords} color="purple">
              <Tooltip>Site</Tooltip>
            </Polygon>
          )}
          {targetLocation && <MoveToLocation lat={targetLocation[0]} lon={targetLocation[1]} />}
          {userLocation && <MoveToLocation lat={userLocation[0]} lon={userLocation[1]} />}
        </MapContainer>
      </div>
      <div style={{ minHeight: '20vh' }}>
        <h3>Locations:</h3>
        <ul>
          {locations.map((loc, idx) => (
            <li key={idx} onClick={() => handleLocationClick(loc)}>
              Location {idx + 1}: {loc.coords[0].toFixed(6)}, {loc.coords[1].toFixed(6)}<br />
              Address: {loc.address}
            </li>
          ))}
        </ul>
        <Typography component="label" endDecorator={<Switch sx={{ ml: 1 }}
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />}>
          Turn {checked ? 'off' : 'on'} polygon site
        </Typography>
      </div>
      <hr />
      <div>
        <center>
          <h3>Search for location</h3>
        </center>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a place..."
        />
        <button onClick={searchPlace}>Search</button>
        <SearchResults searchResults={searchResults} handleSearchResultClick={handleSearchResultClick} />
        <hr />
        <button onClick={getUserLocation}>Get My Location</button>
      </div>
    </div>
  );
}
