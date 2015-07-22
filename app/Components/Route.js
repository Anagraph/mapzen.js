var React = require('react');
var RouteResultTable = require('./RouteResultTable');
var SearchBox = require('./SearchBox');
var polyline = require('polyline');
var $ = require('jquery');

//should replace to tangram later
var SearchWhileRoute = React.createClass({
  render: function(){
    return (
    <div className = "searchBoxContainer">
      <SearchBox 
        value = {this.props.startPoint.name}
        addMarker = {this.props.setStartPoint} 
        currentPoint ={this.props.currentPoint}/>
      <SearchBox 
          value = {this.props.destPoint.name}
          addMarker = {this.props.addMarker}
          currentPoint ={this.props.currentPoint}/>
    </div>
    );
  }
})

var RouteWindow = React.createClass({

  getInitialState : function(){
    return{
      //startPoint must be replaced current location // search result
      activeTab: ""
    }
  },
  //
  route: function(mode){
    //valhalla call form : https://valhalla.mapzen.com/route?json={%22locations%22:[{%22lat%22:39.42923221970601,%22lon%22:-76.6356897354126},{%22lat%22:39.30727282892593,%22lon%22:-76.77203178405762}],%22costing%22:%22auto%22}&api_key=valhalla-RfDii2g
    var serviceurl = "https://valhalla.mapzen.com/";
    var apikey = '&api_key=valhalla-RfDii2g';

    var transitM = mode || 'auto';
    var locs = [];
    locs.push({
      lat : this.props.startPoint.lat,
      lon : this.props.startPoint.lon
    });
    locs.push({
      lat : this.props.destPoint.lat,
      lon : this.props.destPoint.lon
    });

    var self = this;

    var params = JSON.stringify({
      locations: locs,
      costing: transitM
    });

    var routeUrl = serviceurl +  'route?json=' + params + apikey;
    $.get(routeUrl,function(data){
      
      var coord = polyline.decode(data.trip.legs[0].shape,6);
      self.props.addRouteLayer(coord);
      self.mountTable(data);
    });
    //there must be better way to do this
    self.setState({
      activeTab: mode
    })

  },
  mountTable: function(data){
    React.render(<RouteResultTable searchData = {data}/>, document.getElementById('route-result-table'));
  },
  unmountTable: function(){
    React.unmountComponentAtNode(document.getElementById('route-result-table'));
  },

  cancleRouteMode: function(){
    this.props.setMapMode('search');
    this.props.clearMap();
  },
  render: function(){
    return(
      <div>
        <SearchWhileRoute 
          startPoint = {this.props.startPoint}
          addMarker = {this.props.addMarker}
          destPoint = {this.props.destPoint}
          setStartPoint = {this.props.setStartPoint}
          currentPoint ={this.props.currentPoint} />
        <div className="routeBtnGroup segmented-control">
          <a className={(this.state.activeTab === "auto")? "active control-item" : "control-item"} ref="autoBtn" onClick= {this.route.bind(this,"auto")}>
            <div id="autoRoute"></div>
          </a>
          <a className={(this.state.activeTab === "bicycle")? "active control-item" : "control-item"} ref="bicycleBtn" onClick= {this.route.bind(this,"bicycle")}>
            <div id="bikeRoute"></div>
          </a>
          <a className={(this.state.activeTab === "pedestrian")? "active control-item" : "control-item"} ref="pedestrianBtn" onClick= {this.route.bind(this,"pedestrian")} > 
            <div id="walkRoute"></div>
          </a>
        </div>
        <div className="sideBtn">
          <div className="cancelIcon" onClick= {this.cancleRouteMode}></div>
        </div>
        <div id="route-result-table"></div>
      </div>
      )
  }
});

module.exports = RouteWindow;