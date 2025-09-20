import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngTuple, Icon, divIcon } from 'leaflet';
import { CollegeWithDistance, UserLocation } from '../types/college';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const userIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12.5" r="8" fill="#3B82F6" stroke="white" stroke-width="3"/>
      <circle cx="12.5" cy="12.5" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12.5, 12.5]
});

const collegeIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="12" fill="#EF4444" stroke="white" stroke-width="3"/>
      <path d="M8 15L15 10L22 15L15 20L8 15Z" fill="white"/>
    </svg>
  `),
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const highlightedCollegeIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17.5" cy="17.5" r="14" fill="#10B981" stroke="white" stroke-width="4"/>
      <path d="M10 17.5L17.5 12L25 17.5L17.5 23L10 17.5Z" fill="white"/>
      <circle cx="17.5" cy="8" r="3" fill="#FBBF24"/>
    </svg>
  `),
  iconSize: [35, 35],
  iconAnchor: [17.5, 17.5]
});

interface MapViewProps {
  userLocation: UserLocation;
  colleges: CollegeWithDistance[];
  nearestColleges: CollegeWithDistance[];
}

const MapUpdater: React.FC<{ center: LatLngTuple; colleges: CollegeWithDistance[] }> = ({ center, colleges }) => {
  const map = useMap();

  useEffect(() => {
    if (colleges.length > 0) {
      const bounds = [[center[0], center[1]]];
      colleges.forEach(college => {
        bounds.push([college.latitude, college.longitude]);
      });
      map.fitBounds(bounds as any, { padding: [50, 50] });
    }
  }, [map, center, colleges]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ userLocation, colleges, nearestColleges }) => {
  const mapRef = useRef(null);
  const center: LatLngTuple = [userLocation.latitude, userLocation.longitude];

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={8}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} colleges={colleges} />
        
        {/* User location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-blue-600">Your Location</div>
              <div className="text-sm text-gray-600">
                {userLocation.state && `${userLocation.state}`}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* College markers */}
        {colleges.map((college) => {
          const isHighlighted = nearestColleges.some(nc => nc.id === college.id);
          const rank = nearestColleges.findIndex(nc => nc.id === college.id) + 1;
          
          return (
            <Marker
              key={college.id}
              position={[college.latitude, college.longitude]}
              icon={isHighlighted ? highlightedCollegeIcon : collegeIcon}
            >
              <Popup>
                <div className="min-w-48">
                  {isHighlighted && (
                    <div className="mb-2">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        #{rank} Nearest
                      </span>
                    </div>
                  )}
                  <div className="font-semibold text-gray-900 mb-1">{college.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{college.city}, {college.state}</div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">Distance:</span> {college.distance} km
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Travel Time:</span> ~{college.travelTime} min
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Established:</span> {college.established}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;