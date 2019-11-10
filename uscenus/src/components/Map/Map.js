import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import './Map.css';
import US_Outline from './US_Outline.json';

function ArcMap() {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    if (US_Outline) {
      loadModules(
        [
          'esri/Map',
          'esri/views/MapView',
          'esri/layers/GeoJSONLayer',
          'esri/geometry/Polyline'
        ],
        { css: true }
      ).then(([ArcGISMap, MapView, GeoJSONLayer]) => {
        const map = new ArcGISMap({
          basemap: 'topo-vector'
        });

        console.log('test', US_Outline);

        const geoJSONLayer = new GeoJSONLayer({
          url: 'http://localhost:3000/gz_2010_us_outline_20m.json'
          // popupTemplate: template
          // copyright: 'USGS Earthquakes'
        });
        console.log(geoJSONLayer);
        map.add(geoJSONLayer);

        // adds the layer to the map
        // load the map view at the ref's DOM node
        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [-118, 34],
          zoom: 8
        });

        return () => {
          if (view) {
            // destroy the map view
            view.container = null;
          }
        };
      });
    }
  });
  return <div className="webmap" ref={mapRef} />;
}
export default ArcMap;
