import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5hYmVsbGVjaGFuZyIsImEiOiJja20xZmVxNGYwMTRpMnJtemJ0M3podzFzIn0.punpaEzFpzG4kmbcpdtwUQ'

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-71.0799);
  const [lat, setLat] = useState(42.3083)
  const [zoom, setZoom] = useState(11.59);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
    //   style: 'mapbox://styles/mapbox/streets-v11',
      style: 'mapbox://styles/anabellechang/ckm11howb889h17qf87wj3ld6',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;