var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var CurrentLocation = require('./CurrentLocation');
var SearchBox = require('./SearchBox');
var RouteWindow = require('./Route');

require('leafletCss');
require('ratchet');
require('./css/main.css');


var RouteButton = React.createClass({
  route : function(){
    this.props.setMapMode("route");
  },
  render : function(){
    return(
      <div>
        <div className="sideBtn" onClick = {this.route} >
          <div className="route-icon"></div>
        </div>
      </div>
    );
  }
});

var Main = React.createClass({

  getInitialState: function(){
    return{
      // markerLyaer is being mutated, not the way react recommends
      currentPoint : {
        name : "Current location",
        lat: 0,
        lon: 0
      },
      startPoint : {
        name : "Choose start location.",
        lat :  40.7410605,
        lon : -73.9896986
      },
      destMarker : {
        name : "Choose destination.",
        lat :  40.7410605,
        lon : -73.9896986
      },
      poiMarkers:[],
      currentLayer : L.layerGroup(),
      markerLayer : L.layerGroup([L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.')]),
      routeLayer : L.layerGroup(),
      mode : "search"
    }

  },
  setStartPoint: function(mrkr){
    console.log("yes! I am setting startpoint");
    console.log(mrkr);
    this.setState({startPoint:mrkr},function(){
      console.log("updating startPoint");
      console.log(this.state.startPoint);
      this.render();
    });
    console.log(this.state.startPoint);
  },

  setCurrentPoint: function(pos){
    
    var newCurrentLocation = {
      name : "Current location",
      lat: pos.coords.latitude,
      lon: pos.coords.longitude
    }

    this.setState({
      currentPoint : newCurrentLocation,
      startPoint : newCurrentLocation
    },function(){
      var center = L.latLng(pos.coords.latitude,pos.coords.longitude);
      this.state.currentLayer.clearLayers();
      this.state.currentLayer.addLayer(L.circleMarker(center), 3, {
        color: '#00f',
        opacity:1,
        fillColor: '#00f',
        fillOpacity: 0.8,

      });
      this.map.setView(center,14);
      this.setState({
        bbox : this.map.getBounds().toBBoxString()
      });
    });

  },

  addMarker: function(mrkr){

    this.state.markerLayer.clearLayers();
    var marker = L.marker([mrkr.lat,mrkr.lon]);
    //replace not to mutate state directly
    this.state.markerLayer.addLayer(marker);
    
    this.map.setView(marker.getLatLng(),14);
    this.setState({
      destMarker: mrkr,
      bbox : this.map.getBounds().toBBoxString()
    });
  },
  addPOIMarkers: function(mrkrs){
    //this.state.markerLayer.clearLayers();
    var i;
    for(i =0; i<mrkrs.length; i++){
      var marker = new L.marker([mrkrs[i].lat,mrkrs[i].lon]);
      this.state.markerLayer.addLayer(marker);
    }
    this.setState({
      bbox : this.map.getBounds().toBBoxString()
    });
  },
  clearMap : function(){
    this.state.markerLayer.clearLayers();
    this.state.currentLayer.clearLayers();
    this.state.routeLayer.clearLayers();
    this.setState({
      startPoint:{},
      destPoint:{}
    });
  },
  addRouteLayer : function(routes){
    this.state.routeLayer.clearLayers();
    var polylineRoute = L.polyline(routes, {color:'red'});
    this.state.routeLayer.addLayer(polylineRoute);
    this.map.fitBounds(polylineRoute.getBounds());
    this.render();
  },
  setMapMode : function(mapMode){
    this.setState({mode:mapMode});
  },
  createMap: function (element) {
    //React.render(<Map lat="40.758" lon="-73.9174" zoom="4" />,document.body);
    var map = L.map(element,{
      zoomControl:false
    });

    // var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);

    //loading scene yaml
     var layer = Tangram.leafletLayer({
         scene: 'scene.yaml',//sceneYaml,
         attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
     });
    layer.addTo(map);
    return map;
    },

    setupMap: function () {
      this.map.setView([40.758, -73.9174], 10);
      this.setState({
        bbox : this.map.getBounds().toBBoxString()
      });
      this.setMapMode("search");
    },

    componentDidMount: function () {
        if (this.props.createMap) {
            this.map = this.props.createMap(this.getDOMNode());
        } else {
            this.map = this.createMap(document.getElementById('map'));
        }
        this.setupMap();
        this.state.markerLayer.addTo(this.map);
        this.state.currentLayer.addTo(this.map);
        this.state.routeLayer.addTo(this.map);
    },

    render: function () {
      if(this.state.mode == "search"){
      return (
        <div id="mapContainer">
          <div id="map"></div>
          <div className = "searchBoxContainer">
          <SearchBox
            addMarker = {this.addMarker}
            bbox = {this.bbox}/>
          </div>
          <RouteButton 
          destMarker= {this.state.destMarker} 
          addRouteLayer = {this.addRouteLayer}
          setMapMode = {this.setMapMode}
          mode = {this.state.mode}/>
          <CurrentLocation
            setCurrentLocation = {this.setCurrentPoint} />
          <RouteHandler />
        </div>
      );
    }else{
        return(
          <div id="mapContainer">
          <div id="map"></div>
          <RouteWindow 
            startPoint = {this.state.startPoint}
            destPoint = {this.state.destMarker}
            clearMap = {this.clearMap}
            addMarker = {this.addMarker}
            setStartPoint = {this.setStartPoint}
            addRouteLayer = {this.addRouteLayer}
            setMapMode = {this.setMapMode}/>
        </div>
        );
      }
    }
});

module.exports = Main;
