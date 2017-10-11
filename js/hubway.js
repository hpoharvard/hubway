// code by Giovanni Zambotti - May 9 2017
require([
      "esri/config",
      "esri/views/MapView",
      "esri/Map",
      "esri/layers/FeatureLayer",
      "esri/layers/support/Field",
      "esri/geometry/Point",
      "esri/renderers/SimpleRenderer",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/widgets/Legend",
      "esri/request",
      "dojo/_base/array",
      "dojo/dom",
      "dojo/on",
      "dojo/domReady!"
    ], function(esriConfig, MapView, Map, FeatureLayer, Field, Point,
      SimpleRenderer, SimpleMarkerSymbol, Legend, esriRequest,
      arrayUtils, dom, on
    ) {

      var lyr, legend, sInfo = {}, sStatus = {}, sMerge = {};
      var hubpath = "M131.46 71.17c-.21-.06-3.43-.16-3.36-3.44s3.38-3.35 3.64-3.43a1.18 1.18 0 0 0 .57-.74c0-.45 0-.9-.06-1.34a.27.27 0 0 1-.11-.17.94.94 0 0 0-.66-.67c-.22 0-3.41.35-3.84-2.9s2.85-3.81 3.09-3.93a1.19 1.19 0 0 0 .46-.82c-.08-.43-.16-.85-.25-1.27a.27.27 0 0 1-.14-.17.93.93 0 0 0-.76-.55c-.22 0-3.33.85-4.23-2.31s2.25-4.19 2.47-4.34a1.18 1.18 0 0 0 .33-.88l-.45-1.24a.26.26 0 0 1-.15-.13 1 1 0 0 0-.83-.44c-.22 0-3.16 1.34-4.52-1.65s1.6-4.48 1.79-4.66a1.16 1.16 0 0 0 .19-.91c-.21-.4-.43-.8-.65-1.19a.3.3 0 0 1-.16-.11.94.94 0 0 0-.89-.31c-.21.07-2.92 1.79-4.71-.95s.92-4.67 1.08-4.88a1.18 1.18 0 0 0 .06-.91l-.83-1.1a.25.25 0 0 1-.17-.08.93.93 0 0 0-.93-.17c-.2.1-2.62 2.21-4.81-.24s.21-4.75.34-5a1.19 1.19 0 0 0-.07-.91l-1-1a.23.23 0 0 1-.18-.05.92.92 0 0 0-.94 0c-.18.13-2.27 2.57-4.79.48s-.5-4.73-.41-5a1.22 1.22 0 0 0-.22-.91l-1.1-.79a.25.25 0 0 1-.2 0 .94.94 0 0 0-.94.11c-.16.15-1.85 2.88-4.66 1.19s-1.21-4.61-1.15-4.87a1.18 1.18 0 0 0-.36-.87L95.77 7a.28.28 0 0 1-.21 0 .93.93 0 0 0-.91.24c-.13.18-1.41 3.13-4.44 1.87s-1.87-4.37-1.86-4.63a1.22 1.22 0 0 0-.48-.81l-1.26-.42a.28.28 0 0 1-.2 0 .93.93 0 0 0-.86.38c-.11.2-.92 3.3-4.11 2.51s-2.5-4-2.53-4.31a1.21 1.21 0 0 0-.58-.72L77 .88a.24.24 0 0 1-.18.06 1 1 0 0 0-.8.5c-.07.2-.42 3.4-3.68 3.09S69.23.91 69.17.66a1.22 1.22 0 0 0-.68-.66h-1.36a.23.23 0 0 1-.13.09.94.94 0 0 0-.71.61c0 .22.09 3.43-3.18 3.61S59.47 1.19 59.37.94a1.19 1.19 0 0 0-.79-.52l-1.31.16a.28.28 0 0 1-.17.13.91.91 0 0 0-.61.71c0 .22.6 3.38-2.61 4s-4-2.56-4.15-2.78a1.19 1.19 0 0 0-.85-.4l-1.25.35a.27.27 0 0 1-.15.15.93.93 0 0 0-.5.8C47 3.81 48 6.84 45 8s-4.39-2-4.56-2.16a1.2 1.2 0 0 0-.91-.27l-1.22.55a.27.27 0 0 1-.12.16.91.91 0 0 0-.37.86c.06.22 1.56 3.05-1.31 4.64s-4.59-1.26-4.78-1.44a1.19 1.19 0 0 0-.91-.13l-1.15.79a.23.23 0 0 1-.09.16.94.94 0 0 0-.24.91c.09.21 2 2.79-.59 4.78s-4.73-.56-5-.71a1.18 1.18 0 0 0-.91 0l-1 .92a.25.25 0 0 1-.07.17.94.94 0 0 0-.1.93c.12.19 2.4 2.45.12 4.81s-4.75.15-5 0a1.18 1.18 0 0 0-.91.15l-.87 1a.25.25 0 0 1 0 .19.94.94 0 0 0 0 .94c.14.17 2.74 2.06.84 4.74s-4.68.86-4.94.78a1.21 1.21 0 0 0-.89.29c-.24.37-.46.75-.69 1.13a.28.28 0 0 1 0 .21.94.94 0 0 0 .18.92c.17.15 3 1.64 1.54 4.56s-4.5 1.54-4.77 1.51a1.21 1.21 0 0 0-.84.42q-.26.6-.51 1.2a.29.29 0 0 1 0 .21.93.93 0 0 0 .31.89c.19.12 3.23 1.17 2.19 4.28s-4.22 2.2-4.49 2.2a1.21 1.21 0 0 0-.77.53c-.12.44-.22.87-.33 1.31a.27.27 0 0 1 .05.19.92.92 0 0 0 .44.83c.2.09 3.36.68 2.81 3.91S1.29 58.24 1 58.29a1.16 1.16 0 0 0-.66.62c0 .25-.06.5-.08.75s0 .41-.06.62a.24.24 0 0 1 .07.18.94.94 0 0 0 .56.76c.21.06 3.42.16 3.36 3.44S.83 68 .58 68.08a1.18 1.18 0 0 0-.58.74c0 .45 0 .89.07 1.34a.25.25 0 0 1 .11.17.92.92 0 0 0 .66.67c.22 0 3.41-.35 3.84 2.9s-2.85 3.81-3.09 3.93a1.2 1.2 0 0 0-.46.83c.08.42.17.85.26 1.27a.29.29 0 0 1 .14.16.93.93 0 0 0 .76.56c.22 0 3.32-.85 4.23 2.3S4.27 87.17 4 87.32a1.22 1.22 0 0 0-.33.89c.14.42.3.82.45 1.23a.27.27 0 0 1 .16.14.93.93 0 0 0 .83.44c.22 0 3.16-1.34 4.52 1.65s-1.6 4.48-1.79 4.67a1.17 1.17 0 0 0-.2.9c.21.41.43.8.65 1.2a.24.24 0 0 1 .15.11 1 1 0 0 0 .89.31c.21-.07 2.93-1.79 4.72 1s-.85 4.62-1.05 4.84a1.2 1.2 0 0 0-.07.91q.41.56.84 1.1a.24.24 0 0 1 .16.08.93.93 0 0 0 .92.18c.2-.1 2.63-2.21 4.81.24s-.2 4.76-.33 5a1.16 1.16 0 0 0 .07.91l1 1a.25.25 0 0 1 .18.05.94.94 0 0 0 .94 0c.18-.13 2.27-2.57 4.79-.48s.51 4.73.41 5a1.18 1.18 0 0 0 .22.91l1.09.79a.27.27 0 0 1 .2 0 .91.91 0 0 0 .93-.11c.16-.15 1.86-2.88 4.67-1.19s1.2 4.6 1.15 4.86a1.2 1.2 0 0 0 .36.88l1.17.6a.26.26 0 0 1 .22 0 .92.92 0 0 0 .9-.25c.14-.18 1.41-3.12 4.43-1.86s1.94 4.34 1.94 4.61a1.21 1.21 0 0 0 .49.81c.41.15.83.28 1.25.42a.27.27 0 0 1 .2 0 .92.92 0 0 0 .86-.38c.11-.19.93-3.3 4.11-2.51s2.5 4 2.53 4.31a1.17 1.17 0 0 0 .58.72l1.34.24a.25.25 0 0 1 .19-.06.94.94 0 0 0 .79-.51c.08-.21.43-3.4 3.69-3.09s3.08 3.63 3.14 3.89a1.21 1.21 0 0 0 .68.62h1.37a.29.29 0 0 1 .17-.09.92.92 0 0 0 .71-.62c0-.21-.08-3.43 3.19-3.61s3.59 3.12 3.69 3.37a1.22 1.22 0 0 0 .79.52l1.3-.16a.33.33 0 0 1 .17-.13.92.92 0 0 0 .61-.71c0-.22-.6-3.38 2.61-4s4 2.55 4.15 2.78a1.21 1.21 0 0 0 .85.39l1.24-.35a.3.3 0 0 1 .15-.15.93.93 0 0 0 .5-.8c0-.22-1.1-3.25 2-4.39s4.35 1.93 4.52 2.13a1.19 1.19 0 0 0 .91.27l1.22-.55a.28.28 0 0 1 .12-.16.94.94 0 0 0 .37-.86c-.05-.21-1.57-3.05 1.3-4.64s4.59 1.26 4.79 1.44a1.21 1.21 0 0 0 .91.13l1.15-.75a.29.29 0 0 1 .09-.16.93.93 0 0 0 .24-.91c-.09-.21-2-2.79.6-4.78s4.72.56 4.95.71a1.17 1.17 0 0 0 .91 0l1-.92a.26.26 0 0 1 .06-.17.93.93 0 0 0 .11-.93c-.12-.19-2.4-2.45-.12-4.81s4.75-.15 5 0a1.19 1.19 0 0 0 .92-.15c.3-.34.59-.69.87-1a.25.25 0 0 1 0-.19 1 1 0 0 0 0-.94c-.15-.17-2.74-2.06-.84-4.74s4.68-.85 4.93-.78a1.2 1.2 0 0 0 .9-.29l.69-1.13a.28.28 0 0 1 0-.21.93.93 0 0 0-.18-.92c-.16-.15-3-1.64-1.54-4.57s4.5-1.54 4.77-1.5a1.2 1.2 0 0 0 .84-.42c.17-.39.34-.8.51-1.2a.26.26 0 0 1 0-.21.92.92 0 0 0-.31-.89c-.19-.12-3.23-1.17-2.2-4.29s4.22-2.2 4.48-2.2a1.16 1.16 0 0 0 .77-.53c.11-.43.23-.87.33-1.31a.27.27 0 0 1 0-.19.93.93 0 0 0-.44-.83c-.21-.09-3.37-.68-2.81-3.91s3.84-2.8 4.11-2.85a1.19 1.19 0 0 0 .67-.63c0-.25.06-.49.08-.75s0-.41.05-.62a.28.28 0 0 1-.07-.17 1 1 0 0 0-.55-.89zM35 34.9a10.2 10.2 0 0 1 10.23 10.18v44.59h12.5V71.19h18v15.36a22.72 22.72 0 0 0 14.73 21.25 48.16 48.16 0 0 1-67.6-62.72S25 41.37 26 39.83a10.84 10.84 0 0 1 9-4.93zm63.38 61.83A10.2 10.2 0 0 1 88.2 86.55V42H75.69v16.69h-18V45.08a22.73 22.73 0 0 0-14.6-21.2 48.16 48.16 0 0 1 66.68 62.67q-.9 1.91-2 3.74a24.28 24.28 0 0 1-2.05 3.22c-1.47 2.22-4.41 3.22-7.34 3.22z"
      esriConfig.request.corsEnabledServers.push("https://gbfs.thehubway.com");
      /**************************************************
       * Define the specification for each field to create
       * in the layer
       **************************************************/

      var fields = [
      {
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      }, {
        name: "title",
        alias: "title",
        type: "string"
      }];

      var pTemplate = {
        //title: "{title}",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "name",
            label: "Address",
            visible: true
          }, {
            fieldName: "capacity",
            label: "Capacity",
            visible: true
          }, {
            fieldName: "bikesAvailable",
            label: "Bikes Available",
            visible: true
          }, {
            fieldName: "bikesDisabled",
            label: "Bikes Disabled",
            visible: true
          }, {
            fieldName: "docksAvailable",
            label: "Docks Available",
            visible: true
          }, {
            fieldName: "docksDisabled",
            label: "Docks Disabled",
            visible: true
          }, {
            fieldName: "lastReported",
            label: "Last Reported",
            visible: true
          }
          ]
        }],
        fieldInfos: [{
          fieldName: "time",
          format: {
            dateFormat: "short-date-short-time"
          }
        }]
      };

      /**************************************************
       * Create the map and view
       **************************************************/

      var map = new Map({
        basemap: "gray"
      });

      // Create MapView
      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-71.116076, 42.37375],
        zoom: 14,
        // customize ui padding for legend placement
        ui: {
          padding: {
            bottom: 15,
            right: 0
          }
        }
      });

      /**************************************************
       * Define the renderer for symbolizing earthquakes
       **************************************************/

      var hubwayRenderer = new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          /*style: "circle",*/
          path: hubpath,
          size: 20,
          color: [73, 169, 66],
          outline: {
            width: 0,
            color: "#49a942",
            style: "solid"
          }
        }),
        /*visualVariables: [
        {
          type: "size",
          field: "mag", // earthquake magnitude
          valueUnit: "unknown",
          minDataValue: 2,
          maxDataValue: 7,
          // Define size of mag 2 quakes based on scale
          minSize: {
            type: "size",
            expression: "view.scale",
            stops: [
            {
              value: 1128,
              size: 12
            },
            {
              value: 36111,
              size: 12
            },
            {
              value: 9244649,
              size: 6
            },
            {
              value: 73957191,
              size: 4
            },
            {
              value: 591657528,
              size: 2
            }]
          },
          // Define size of mag 7 quakes based on scale
          maxSize: {
            type: "size",
            expression: "view.scale",
            stops: [
            {
              value: 1128,
              size: 80
            },
            {
              value: 36111,
              size: 60
            },
            {
              value: 9244649,
              size: 50
            },
            {
              value: 73957191,
              size: 50
            },
            {
              value: 591657528,
              size: 25
            }]
          }
        }]*/
      });

      view.then(function() {
          getStationsData();
          getStationsStatus();          
          //.then(createLayer) // when graphics are created, create the layer
          //.then(createLegend) // when layer is created, create the legend
          //.otherwise(errback);
      });

      // Request Hubway Stations
      function getStationsData() {
        var url = "https://gbfs.thehubway.com/gbfs/en/station_information.json";
        //var url = "station_information.json";
        esriRequest(url, {
          responseType: "json"
        }).then(function(response){
          // The requested data          
          for(var key in response.data) sInfo[key] = response.data[key];
        });        
      }

      // request Hubaway Stationa Status      
      function getStationsStatus() {
        var url = "https://gbfs.thehubway.com/gbfs/en/station_status.json";
        //var url = "station_status.json";
        esriRequest(url, {
          responseType: "json"
        }).then(function(response){
          // The requested data          
          for(var key in response.data) sStatus[key] = response.data[key];
        });        
      }      
      
      document.getElementById("showHubway").addEventListener("click", function(){
          combine(sInfo, sStatus)
      });

      function combine(obj1, obj2) {
        //console.log(obj1, obj2)
        /*var combinedObject = Object.assign({}, obj1);
        //console.log(combinedObject)
        for(var key in obj2) {
          console.log(key)
          if(typeof obj2[key] !== "object") {
            if(obj1[key] !== obj2[key]) {
              var keyName = key;
              if(key in obj1) {
                keyName = keyName + "_conflict";
              }
              combinedObject[keyName] = obj2[key];
            }
          } else {
            combinedObject[key] = combine(obj1[key], obj2[key]);
          
        }
        //console.log(combinedObject)
        //return combinedObject;*/

        obj1.data.stations.forEach(function(item, i) {
          Object.assign(item, obj2.data.stations[i])
        });
        
        createLayer(createGraphics(obj1))
      }

      /**************************************************
       * Create graphics with returned geojson data
       **************************************************/

      function createGraphics(response) {
        // raw GeoJSON data
        //var geoJson = response.data;        
        // Create an array of Graphics from each GeoJSON feature
        console.log(response.data.stations)
        return arrayUtils.map(response.data.stations, function(feature, i) {          
          return {
            geometry: new Point({
              x: feature.lon,
              y: feature.lat
            }),
            // select only the attributes you care about
            attributes: {
              ObjectID: i,              
              capacity: feature.capacity.toString(),
              name: feature.name,              
              bikesAvailable: feature.num_bikes_available.toString(),
              bikesDisabled: feature.num_bikes_disabled.toString(),
              docksAvailable: feature.num_docks_available.toString(),
              docksDisabled: feature.num_docks_disabled.toString(),
              lastReported: new Date().toUTCString()//feature.last_reported
            }
          };
        });        
      }

      /**************************************************
       * Create a FeatureLayer with the array of graphics
       **************************************************/

      function createLayer(graphics) {
        console.log(graphics)
        lyr = new FeatureLayer({
          source: graphics, // autocast as an array of esri/Graphic
          // create an instance of esri/layers/support/Field for each field object
          fields: fields, // This is required when creating a layer from Graphics
          objectIdField: "ObjectID", // This must be defined when creating a layer from Graphics
          renderer: hubwayRenderer, // set the visualization on the layer
          spatialReference: {
            wkid: 4326
          },
          geometryType: "point", // Must be set when creating a layer from Graphics
          popupTemplate: pTemplate
        });
        
        map.add(lyr);
        return lyr;
      }

      /******************************************************************
       * Add layer to layerInfos in the legend
       ******************************************************************/

      /*function createLegend(layer) {
        // if the legend already exists, then update it with the new layer
        if (legend) {
          legend.layerInfos = [{
            layer: layer,
            title: "Magnitude"
          }];
        } else {
          legend = new Legend({
            view: view,
            layerInfos: [
            {
              layer: layer,
              title: "Earthquake"
            }]
          }, "infoDiv");
        }
      }*/

      // Executes if data retrieval was unsuccessful.
      function errback(error) {
        console.error("Creating legend failed. ", error);
      }

    });