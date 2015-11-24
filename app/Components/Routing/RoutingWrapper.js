import React, { Component} from 'react';

import RouteWindow from './RouteWindow';

import { Provider, connect } from 'react-redux';
import store from '../../reducer';
import Actions from '../../actions';

import MapObject from '../Map/MapObject';

class RoutingWrapper extends Component {
  render () {
    return (
        <RouteWindow 
            startPoint = {this.props.startPoint}
            setStartPoint = {this.props.setStartPoint}
            setDestPoint = {this.props.setDestPoint}
            currentPoint ={this.props.currentPoint}
            destPoint = {this.props.destPoint}
            linknode = {this.props.linknode}
            location = {this.props.location}
            history = {this.props.history}
            clearMap = {this.props.clearMap}
            addMarker = {this.props.addMarker}
            addRouteLayer = {this.props.addRouteLayer}
            setMapMode = {this.setMapMode}/>
    )
  }
}

function mapStateToProps(state) {
    if (typeof state === 'undefined') {
    state = {
      startPoint: {},
      destPoint: {},
      currentPoint: {},
      linknode: '/maps/direction',
      mode: ""
    };
  }
  return {
    routerState: state.router,
    startPoint: state.updatePoint.startPoint,
    destPoint: state.updatePoint.destPoint,
    currentPoint: state.updatePoint.currentPoint,
    linknode: '/maps/direction',
    mode: state.updatePoint.mode
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addMarker: function(mrkr) {
      MapObject.addMarker(mrkr);
    },
    setStartPoint: function(location) {
      store.dispatch(Actions.updateStartPointAction(location));
    },
    setDestPoint: function(location) {
      store.dispatch(Actions.updateDestPointAction(location));
    },
    clearMap: function() {
      MapObject.clearMap();
    },
    addRouteLayer: function(routes, startPoint, destPoint) {
      MapObject.addRouteLayer(routes, startPoint, destPoint);
    }
  }
}

var ConnectedRouting = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutingWrapper);

module.exports = ConnectedRouting;