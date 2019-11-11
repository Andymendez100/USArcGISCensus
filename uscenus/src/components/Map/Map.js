import React, { useEffect, useRef } from 'react';

// ArcGIS Layers
import { loadModules } from 'esri-loader';

import './Map.css';
// Json Data
import US_Outline from '../../data/US_Outline.geojson';
import US_States from '../../data/US_States.geojson';
import US_Counties from '../../data/US_Counties.geojson';
import US_Congressional from '../../data/US_Congressional.geojson';

// Layer styling
import { outlineRenderer, stateRenderer, congressionalRenderer, countiesRenderer, } from './layerStyles';

// utili to populated the popup
import statePopup from '../../utils/languagePopup'


const ArcMap = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS

    loadModules(
      [
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/GeoJSONLayer',
      ],
      { css: true }
    ).then(([ArcGISMap, MapView, GeoJSONLayer]) => {


      const map = new ArcGISMap({
        basemap: 'gray-vector'
      });

      const generateGeoJSONLayer = (data, render) => {
        return new GeoJSONLayer({
          url: data,
          renderer: render
        });
      }

      const USOutline = generateGeoJSONLayer(US_Outline, outlineRenderer);
      const USCounties = generateGeoJSONLayer(US_Counties, countiesRenderer)
      const USCongressional = generateGeoJSONLayer(US_Congressional, congressionalRenderer);

      const USStates = new GeoJSONLayer({
        url: US_States,
        renderer: stateRenderer,
        outFields: ['NAME', 'STATE'],
        popupTemplate: statePopup
      });

      map.add(USCongressional);
      map.add(USStates);
      map.add(USCounties);
      map.add(USOutline);

      document.getElementById('outline').onclick = () => USOutline.visible = !USOutline.visible;
      document.getElementById('states').onclick = () => USStates.visible = !USStates.visible;
      document.getElementById('counties').onclick = () => USCounties.visible = !USCounties.visible;
      document.getElementById('congressional').onclick = () => USCongressional.visible = !USCongressional.visible;

      // adds the layer to the map
      // load the map view at the ref's DOM node

      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [-95, 40],
        zoom: 2
      });

      return () => {
        if (view) {
          // destroy the map view
          view.container = null;
        }
      };
    });

  });
  return (
    <div>
      <h2>U.S 2013 Census Map</h2>
      <button id="outline">Toggle US OutLine</button>
      <button id="states">Toggle US States</button>
      <button id="counties">Toggle US Counties</button>
      <button id="congressional">Toggle US congressional</button>
      <div className="webmap" ref={mapRef} />
    </div>
  )
}
export default ArcMap;
