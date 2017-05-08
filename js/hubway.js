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

      var quakesRenderer = new SimpleRenderer({
        symbol: new SimpleMarkerSymbol({
          style: "circle",
          size: 8,
          color: [113, 244, 66, 0.8],
          outline: {
            width: 1.5,
            color: "#009933",
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
          renderer: quakesRenderer, // set the visualization on the layer
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