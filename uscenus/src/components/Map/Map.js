import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import './Map.css';
import US_Outline from './US_Outline.json';

function ArcMap() {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      ['esri/Map', 'esri/views/MapView', 'esri/layers/GeoJSONLayer'],
      { css: true }
    ).then(([ArcGISMap, MapView, GeoJSONLayer]) => {
      const map = new ArcGISMap({
        basemap: 'topo-vector'
      });

      console.log(US_Outline);
      //   const geoJSONLayer = new GeoJSONLayer({
      //     // data: US_Outline
      //     url:
      //       'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
      //     copyright: 'USGS Earthquakes'
      //   });
      //   console.log(geoJSONLayer);

      //   map.add(geoJSONLayer); // adds the layer to the map

      const geoJSONLayer = new GeoJSONLayer({
        url:
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
        copyright: 'USGS Earthquakes'
      });
      map.add(geoJSONLayer); // adds the layer to the map
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
  });
  return <div className="webmap" ref={mapRef} />;
}
export default ArcMap;
