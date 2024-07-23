
import React, { useState } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const MapComponent = (props) => {
    const { location } = props; // obtain the location property
    console.log(location);
    const [map, setMap] = useState(null);

    const mapContainerStyle = { //style the map container by specifying height, width, etc
        width: '100%',
        height: '400px',
        marginBottom: "10px"
    };

    const center = {
        lat: location.coordinates[1], // Latitude
        lng: location.coordinates[0], // Longitude
    };

    const markerPosition = center;

    // Define options for the default red marker icon
    let markerIcon;

    const onLoad = (map) => {
        setMap(map);
        markerIcon = {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            // scaledSize: new window.google.maps.Size(25, 25) // Adjust the size as needed
            // Adjust anchor point to center-bottom
            // anchor: new window.google.maps.Point(25, 50), // Uncomment if anchor adjustment is needed
        };
    };
    // Function to generate Google Maps URL with destination coordinates
    const getGoogleMapsUrl = () => {
        const latLng = `${markerPosition.lat},${markerPosition.lng}`;
        return `https://www.google.com/maps/search/?api=1&query=${latLng}`;
    };

    return (
        // <LoadScript
        //     googleMapsApiKey="AIzaSyAkzD8dg5FdfKM52FLZwXXhLK8Rzw5yv8Q"
        //     libraries={libraries}
        // >
            <>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                >
                    {map && <MarkerF position={markerPosition} icon={markerIcon} />}
                </GoogleMap>
                <a
                    href={getGoogleMapsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", margin: "15px 0px" }}
                >
                    Open in Google Maps
                </a>
            </>
        // </LoadScript>
    );
};

export default MapComponent;



