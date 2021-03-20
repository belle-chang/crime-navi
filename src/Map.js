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
      style: 'mapbox://styles/mapbox/streets-v11',
    //   style: 'mapbox://styles/anabellechang/ckm11howb889h17qf87wj3ld6',
      center: [lng, lat],
      zoom: zoom
    });


    map.on('load', function() {
        map.addSource("crime", {
            type: 'geojson',
            // data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson'
            data: 'https://raw.githubusercontent.com/belle-chang/navi-crime/main/data/jsonformatter-2.json',
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });
        // https://docs.mapbox.com/mapbox-gl-js/example/cluster/
        // Add our layer
        map.addLayer({
            id: "clusters",
            source: "crime", // this should be the id of the source
            type: "circle",
            filter: ['has', 'point_count'],
            // paint properties
            paint: {
            //   "circle-opacity": 0.75,
            //   "circle-stroke-width": 1,
            //   "circle-radius": 4,
            //   "circle-color": "#FFEB3B"
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    25,
                    '#f1f075',
                    100,
                    '#f28cb1'
                    ],
                    'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    25,
                    30,
                    100,
                    40
                ]
            },
            layout: {
                // make layer visible by default
                'visibility': 'visible'
            }
        });

        map.addLayer({
            id: 'cluster-count',
            // id: 'clusters',
            type: 'symbol',
            source: 'crime',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
                'visibility': 'visible'
            }
        });

        map.addLayer({
            id: 'unclustered-point',
            // id: 'clusters',
            type: 'circle',
            source: 'crime',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
                },
            layout: {
                // make layer visible by default
                'visibility': 'visible'
                }
            });
    });

    // Add navigation control (the +/- zoom buttons)
    // Add navigation controls to the top right of the canvas
    map.addControl(new mapboxgl.NavigationControl());
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', function() {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // CHANGE: Add layer names that need to be toggled
    var dictionary = {
        bos: ['clusters', 'cluster-count'],
        extra: ['unclustered-point']
    }

    for (let key in dictionary) {
        // check if the property/key is defined in the object itself, not in parent
        if (dictionary.hasOwnProperty(key)) {           
            console.log(key, dictionary[key]);

            var link = document.createElement('a');
            link.href = '#';
            link.className = 'active';
            link.textContent = key;
            link.onclick = function (e) {
                
                for (var index in dictionary[key]) {
                var clickedLayer = dictionary[key][index];
                e.preventDefault();
                e.stopPropagation();
            
                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
            
                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    this.className = '';
                } else {
                    this.className = 'active';
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                }
            }
            
        };
        var layers = document.getElementById('menu');
        layers.appendChild(link);
        }
    }
    // var toggleableLayerIds = ['clusters', 'cluster-count', 'unclustered-point'];

    // var link = document.createElement('a');
    // link.href = '#';
    // link.className = 'active';
    // link.textContent = "toggle layers";
    // link.onclick = function (e) {
    //     for (var index in toggleableLayerIds) {
    //     var clickedLayer = toggleableLayerIds[index];
    //     e.preventDefault();
    //     e.stopPropagation();
    
    //     var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
    
    //     if (visibility === 'visible') {
    //         map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    //         this.className = '';
    //     } else {
    //         this.className = 'active';
    //         map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    //     }
    //     }
        
    // };
    // var layers = document.getElementById('menu');
    // layers.appendChild(link);

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
        <nav id="menu"></nav>
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