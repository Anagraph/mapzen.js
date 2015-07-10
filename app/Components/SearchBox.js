var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
require('ratchet');
require('./css/main.css');


var ResultRow = React.createClass({
  handleClick: function(){
    var marker = L.marker(this.props.loc.reverse());
    marker.bindPopup(this.props.name);
    var markerToMap = {
      name : this.props.name,
      lat : marker.getLatLng().lat,
      lon : marker.getLatLng().lng
    };
    this.props.addMarker(markerToMap);
    this.props.setInputValue(this.props.name);
    this.props.deactivateSearching();
  },
  render: function(){
    var displayName = this.props.name;
    return(
    <li className="table-view-cell" onClick= {this.handleClick} > {displayName} </li>
    );
  }
});

var ResultTable = React.createClass({
  render: function(){
    var rows = [];
      if(this.props.searchData.length > 0 && this.props.searching ){
        var self = this;
        this.props.searchData.forEach(function(result){
          rows.push(<ResultRow name = {result.properties.name + " , " + result.properties.local_admin + " , " + result.properties.admin1_abbr} 
                               loc= {result.geometry.coordinates} 
                               key= {result.properties.id} 
                               addMarker = {self.props.addMarker} 
                               searching = {self.props.searching}
                               setInputValue = {self.props.setInputValue}
                               deactivateSearching = {self.props.deactivateSearching}/>)
        });
    }

    return(
      <ul className="table-view search-table">
        {rows}
      </ul>
    );
  }
});



var SearchBox = React.createClass({
//  mixinsL [Router.navigation],

  getInitialState: function(){
    return{ 
      searchResult : [],
      searching : false,
      filterText: this.props.value || ""
    };
  },

  handleChange: function(){
    var currentType = this.refs.filterTextInput.getDOMNode().value;
    this.makeCall(currentType);
    var searchResult = this.state.searchResult;
    this.setState({
      filterText : currentType,
      searching: true});
  },

  deactivateSearching:function(){
    this.setState({searching: false});
  },

  setInputValue: function(val){
    this.setState({
      filterText : val
    });
    this.refs.filterTextInput.getDOMNode().value = val;
  },

  makeCall: function(currentInput){
    // pelias api form : https://pelias.mapzen.com/suggest?bbox=-74.18861389160156,40.62802447679272,-73.79173278808594,40.86134282702074&input=we+are
    var self = this;
    if(currentInput.length > 0){
      var baseurl = '//pelias.mapzen.com';
      var bbox = this.props.bbox || '-74.18861389160156,40.62802447679272,-73.79173278808594,40.86134282702074';
      var lat = this.props.currentLat || null;
      var lon = this.props.currentLon || null;
      var input = currentInput;
      var zoom = 12;
      var searchData;

      var callurl ;
      if(lat) callurl = baseurl + "/suggest?bbox=" + bbox + "&input="+ currentInput+ "&lat="+lat+"&lon="+lon+"&zoom="+ zoom;
      else callurl = baseurl + "/suggest?bbox=" + bbox + "&input="+ currentInput;

    $.get(callurl,function(data){
      //this is not the way react recommends
      self.setState({searchResult: data.features});
    });
    }else{
      self.setState({searchResult: []})
    }

  },

  render: function(){
    var secondaryStyle = {
      top : 50
    };
    return(
      <div>
        <input style = {this.props.style}
        className="searchBox" 
        ref = "filterTextInput" 
        type = "search" 
        value = {this.state.filterText} 
        onChange={this.handleChange}></input>
        <ResultTable searchData = {this.state.searchResult}
                      searching = {this.state.searching} 
                      addMarker = {this.props.addMarker}
                      setInputValue = {this.setInputValue}
                      deactivateSearching = {this.deactivateSearching} />
      </div>
    );
  }
});

module.exports = SearchBox;