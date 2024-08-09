import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip ,useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { Button, Switch,Grid } from '@mui/joy';
import Typography from '@mui/joy/Typography';

import '../styles/SiteBuildingsMap.css';


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
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
    });
};

function MoveToLocation({ lat, lon }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lon) {
            map.setView([lat, lon], 17);
        }
    }, [lat, lon, map]);

    return null;
}

export default function SiteBuildingsMap({ chosenSiteBuildings }) {

    const [polygonCoords, setPolygonCoords] = useState([]);
    const [customIcon, setCustomIcon] = useState(createCustomIcon());
    const [checked, setChecked] = useState(false);
    const [targetLocation, setTargetLocation] = useState(null);

    useEffect(() => {
        const icon = createCustomIcon();
        setCustomIcon(icon);
    }, []);
    
    useEffect(() => {
        if (chosenSiteBuildings && chosenSiteBuildings.length > 0) {
            const initialPolygonCoords = chosenSiteBuildings.map(building => {
                const [latitude, longitude] = building.location.slice(1, -1).split(',').map(coord => parseFloat(coord));
                return [latitude, longitude];
            });
            setPolygonCoords(initialPolygonCoords);
        }
    }, [chosenSiteBuildings]);

    const firstBuildingLocation = (chosenSiteBuildings && chosenSiteBuildings.length > 0)
        ? chosenSiteBuildings[0].location.slice(1, -1).split(',').map(coord => parseFloat(coord))
        : [33.908089, -5.578308];

    return (
        <div>
            <div style={{ flex: 1, height: '80vh',marginTop:'20px' }}>
                <MapContainer center={firstBuildingLocation} zoom={6} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {chosenSiteBuildings && chosenSiteBuildings.length > 0 && (
                        chosenSiteBuildings.map((loc, idx) => {
                            const [latitude, longitude] = loc.location.slice(1, -1).split(',').map(coord => parseFloat(coord));
                            return (
                                <Marker key={idx} position={[latitude, longitude]} icon={customIcon}>
                                    <Popup>
                                        Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}<br />
                                        Address: {loc.address}
                                    </Popup>
                                </Marker>
                            );
                        })
                    )}
                    {checked && polygonCoords.length > 2 && (
                        <Polygon positions={polygonCoords} color="purple">
                            <Tooltip>Site</Tooltip>
                        </Polygon>
                    )}
                    {targetLocation && <MoveToLocation lat={targetLocation[0]} lon={targetLocation[1]} />}
                </MapContainer>
            </div>
            <div style={{ minHeight: '10vh',display:'flex',justifyContent:'center',alignItems:'center' }}>
                <Typography component="h3" endDecorator={
                    <Switch sx={{ ml: 1 }}
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                    />
                }>
                    {checked ? 'Hide' : 'Show'} site boundaries
                </Typography>
            </div>
            <div>
                <h3>Buildings Locations:</h3>
                <ul>
                    {chosenSiteBuildings.map((site, idx) => {
                        const [latitude, longitude] = site.location.slice(1, -1).split(',').map(coord => parseFloat(coord));
                        return (
                            <li 
                            className="locationList"
                            key={idx} onClick={() => setTargetLocation([latitude, longitude])}
                            style={{width:'100%'}}
                            >
                                <Grid container spacing={2} sx={{ flexGrow: 1 ,width:'100%'}}>
                                    <Grid xs={12} lg={8} >
                                        <span>
                                            <strong>Building {idx + 1}:</strong> <br />
                                            <span>
                                                Address: {site.address}
                                            </span><br />
                                            <span>
                                                Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                            </span>
                                        </span>
                                    </Grid>
                                    <Grid xs={12} lg={4} sx={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                        <span>
                                            <Button sx={{
                                                backgroundColor: 'blue',
                                                marginRight:'5px'
                                            }}>Show details</Button>
                                            <Button sx={{
                                                backgroundColor: 'red',
                                            }}>Delete building</Button>
                                        </span>
                                    </Grid>
                                </Grid>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
