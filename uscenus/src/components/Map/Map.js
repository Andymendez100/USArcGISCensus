import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import './Map.css';
import US_Outline from './US_Outline.geojson';
import US_States from './US_States.geojson';
import US_Counties from './US_Counties.geojson';
import US_Congressional from './US_Congressional.geojson';

var outlineRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 3,
  symbol: {
    type: "simple-line",
    color: 'rgba(43, 45, 66, 0.9)'
  },
}

var stateRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 4,
  symbol: {
    type: "simple-line",
    color:
      'rgb(141,153,174 )'
  },
}

var countiesRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 1,
  symbol: {
    type: "simple-line",
    color:
      'rgba(239,35,60, 0.3)'
  },
}

var CongressionalRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 2,
  symbol: {
    type: "simple-line",
    color:
      'rgba(217,4,41, 0.7)'
  },
}


function ArcMap() {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS

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
        basemap: 'gray-vector'
      });

      const USOutline = new GeoJSONLayer({
        url: US_Outline,
        renderer: outlineRenderer
      });

      const USStates = new GeoJSONLayer({
        url: US_States,
        renderer: stateRenderer
      });

      const USCounties = new GeoJSONLayer({
        url: US_Counties,
        renderer: countiesRenderer
      });

      const USCongressional = new GeoJSONLayer({
        url: US_Congressional,
        renderer: CongressionalRenderer
      });

      map.add(USCongressional);
      map.add(USCounties);
      map.add(USStates)
      map.add(USOutline);


      // adds the layer to the map
      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-118, 34],
        zoom: 3
      });

      return () => {
        if (view) {
          // destroy the map view
          view.container = null;
        }
      };
    });

  });
  return <div className="webmap" ref={mapRef} />;
}
export default ArcMap;
