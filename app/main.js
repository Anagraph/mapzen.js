//general problem : when vendors are managed in vendor folder, asset path throws err :( 
var React = require('react');
var L = require('leaflet');
var $ = require('jquery');

require('react-leaflet');
require('leafletCss');
require('./main.css');

//should replace to tangram later
//var sceneYaml = require("file!./scene.yaml");

var ResultRow = React.createClass({
  handleClick: function(){
    var markers = [];
    var marker = L.marker(this.props.loc.reverse());
    marker.bindPopup(this.props.name);
    markers.push(marker);
    this.props.addMarkers(markers);
  },

  render: function(){
    var displayName = this.props.name;
    return(
      <tr>
        <td class="resultRow" onClick= {this.handleClick} > {displayName} </td>
      </tr>
    );
  }
});

var ResultTable = React.createClass({
  render: function(){
    var rows = [];
      if(this.props.searchData.length > 0){
        var self = this;
        this.props.searchData.forEach(function(result){
          rows.push(<ResultRow name = {result.properties.name} loc= {result.geometry.coordinates} key= {result.properties.id} addMarkers = {self.props.addMarkers}/>)
        });
    }

    return(
      <table id="searchTable">
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var SearchBox = React.createClass({

  getInitialState: function(){
    return{ searchResult:[]};
  },

  handleChange: function(){
    var currentType = this.refs.filterTextInput.getDOMNode().value;
    this.makeCall(currentType);
    var searchResult = this.state.searchResult;
    this.props.onUserInput(currentType);
    
  },

  makeCall: function(currentInput){
    // pelias api form : https://pelias.mapzen.com/suggest?bbox=-74.18861389160156,40.62802447679272,-73.79173278808594,40.86134282702074&input=we+are&lat=40.7448&lon=-73.9902&size=10&zoom=12
    var self = this;
    if(currentInput.length > 0){
      var baseurl = '//pelias.mapzen.com';
      var bbox = '-74.18861389160156,40.62802447679272,-73.79173278808594,40.86134282702074';
      var input = currentInput;
      var lat = '40.744';
      var lon = '-73.990';
      var zoom = 12;
      var searchData;

      var callurl = baseurl + "/suggest?bbox=" + bbox + "&input="+ currentInput + "&lat="+lat+"&lon="+lon+"&zoom="+ zoom;
    $.get(callurl,function(data){
      //this is not the way react recommends
      self.setState({searchResult: data.features});
    });
  }else{
    self.setState({searchResult: []})
  }

  },

  render: function(){
    return(
      <div id="searchBar">
        <input id="searchBox" ref = "filterTextInput" type = "text" value = {this.props.filterText}  onChange={this.handleChange}></input>
        <input id="searchBtn" value = "DO" type="button"> </input>
        <ResultTable searchData = {this.state.searchResult} addMarkers = {this.props.addMarkers}/>
      </div>
    );
  }
});


var Map = React.createClass({

  createMap: function (element) {
    var map = L.map(element);
    var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    
    // loading scene yaml
    // var layer = Tangram.leafletLayer({
    //     scene: 'scene.yaml',//sceneYaml,
    //     attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    // });


    layer.addTo(map);
    //L.marker([40.729614,-73.993837]).addTo(map);
    return map;
    },


    setupMap: function () {
      this.map.setView([this.props.lat, this.props.lon], this.props.zoom);
    },

    componentDidMount: function () {
        if (this.props.createMap) {
            this.map = this.props.createMap(this.getDOMNode());
        } else {
            this.map = this.createMap(this.getDOMNode());
        }

        this.setupMap();
    },

    addMarker: function(){
      var self = this;
      console.log("how can I be called?");
      this.props.markers.forEach(function(eachMarker){
        eachMarker.addTo(self.map);
        console.log("added");
      });
    },

    render: function () {
      return (<div id="map"></div>);
    }

});


var MapApp = React.createClass({

  getInitialState: function(){
    return{
      markers: []
    }
  },

    handleUserInput: function(filterText) {
      console.log("handleuserinput from map app");
        this.setState({
            filterText: filterText
        });
    },

    addMarkers: function(mrkrs){
       this.setState({
         markers: mrkrs
       });  
    },

    render: function(){
      console.log("whole map app render called");
      return (
        <div>
          <SearchBox onUserInput={this.handleUserInput} markers= {this.state.markers} addMarkers = {this.addMarkers} />
          <Map lat="40.758" lon="-73.9174" zoom="14" markers= {this.state.markers} />
        </div>
      );
    }
});

 React.render(<MapApp />,document.body);
