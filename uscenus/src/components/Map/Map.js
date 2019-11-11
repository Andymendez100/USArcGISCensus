import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import './Map.css';
import US_Outline from './US_Outline.geojson';
import US_States from './US_States.geojson';
import US_Counties from './US_Counties.geojson';
import US_Congressional from './US_Congressional.geojson';
import axios from 'axios';

const outlineRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 3,
  symbol: {
    type: "simple-line",
    color: 'rgba(43, 45, 66, 0.9)'
  },
}

const stateRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 4,
  symbol: {
    type: "simple-fill",
    color:
      'rgb(141,153,174 )'
  },
}

const countiesRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 1,
  symbol: {
    type: "simple-line",
    color:
      'rgba(239,35,60, 0.3)'
  },
}

const congressionalRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  size: 4,
  symbol: {
    type: "simple-line",
    color:
      'rgba(217,4,41, 0.7)'
  },
}



var statePopup = {

  "id": "{STATE}",
  "title": "{NAME}",
  "content": async function (event) {
    const { STATE } = event.graphic.attributes;

    /**
     * Retrieves data for selected state - returns object with language categories by state [estimate, label, state]
     * Return is of type promise 
     */
    const selectedStateCategories = axios.get(`https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:${STATE}&LAN7&key=f25fc11700bcf786378aa57f5ac9c5d26bb0bea6`)
      .then(resp => {
        const arr = resp.data.slice(1);

        if (arr) {
          return arr.map(category => ({
            estimate: category[0],
            label: category[1],
            state: category[2],
          }))
        }
      });

    // use selectedState as a promise (returns all language categories)
    const selectedStateLanguages = axios.get(`https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=state:${STATE}&LAN&key=f25fc11700bcf786378aa57f5ac9c5d26bb0bea6`)
      .then(resp => {
        const data = resp.data.slice(1);

        if (data) {
          return data
            .sort((a, b, ) => b[0] - a[0])
            .slice(0, 6)
            .map(lang => ({
              estimate: lang[0],
              name: lang[1],
              code: lang[3]
            }));
        }
      });

    const categories = await selectedStateCategories;
    const languages = await selectedStateLanguages;

    if (categories && languages) {
      return "<p align='left'><strong>Language Categories</strong> </br>" +
        categories.map(category => `<strong>${category.label}: </strong> ${category.estimate} </br> `).join("") + "</p>" +
        "<p align='left'><strong>Top Spoken Languages (excluding English) </strong> </br>" +
        languages.map(language => `<strong>${language.name}: </strong> ${language.estimate} </br> `).join("") + "</p>"
    }


  }

}


function ArcMap() {
  const mapRef = useRef();

  useEffect(() => { //dafuq are you doing mang??
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

      const USOutline = new GeoJSONLayer({
        url: US_Outline,
        renderer: outlineRenderer
      });

      const USStates = new GeoJSONLayer({
        url: US_States,
        renderer: stateRenderer,
        outFields: ['NAME', 'STATE'],
        popupTemplate: statePopup
      });

      const USCounties = new GeoJSONLayer({
        url: US_Counties,
        renderer: countiesRenderer
      });

      const USCongressional = new GeoJSONLayer({
        url: US_Congressional,
        renderer: congressionalRenderer
      });

      map.add(USStates)
      map.add(USCongressional);
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
  return (
    <div>
      <h2>My Map</h2>
      <button id="outline">Toggle US OutLine</button>
      <button id="states">Toggle US States</button>
      <button id="counties">Toggle US Counties</button>
      <button id="congressional">Toggle US congressional</button>
      <div className="webmap" ref={mapRef} />;
    </div>
  )
}
export default ArcMap;
