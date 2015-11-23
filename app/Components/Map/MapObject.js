var MapObject = (function(){

  var map;
  var currentLayer = L.layerGroup();
  var markerLayer = L.layerGroup();
  var routeLayer = L.layerGroup();
  var markerIcon;
  var startMakerIcon;


  var _init = function() {
    map = L.map(document.getElementById('map'), {
      zoomControl:false
    });


    var layer = Tangram.leafletLayer({
      scene: 'https://cdn.rawgit.com/tangrams/cinnabar-style-more-labels/gh-pages/cinnabar-style-more-labels.yaml',
      attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });
    map.setView([40.7099948, -74.0298132], 12);

    markerIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjEwIDE2IDUwIDUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDEwIDE2IDUwIDUwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojQ0NDQ0NDO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMzEuNiwxOC41Yy04LjksMC4xLTE2LjEsNy40LTE2LjEsMTYuM2MwLjEsOC45LDE2LjQsMjguNywxNi40LDI4LjdzMTUuOS0yMCwxNS45LTI5LjENCglDNDcuOCwyNS42LDQwLjUsMTguNCwzMS42LDE4LjV6IE0zNS43LDM3LjRjLTIsMi01LjQsMi03LjQsMGMtMi0yLTItNS40LDAtNy40czUuNC0yLDcuNCwwQzM3LjcsMzIsMzcuNywzNS40LDM1LjcsMzcuNHoiLz4NCjwvc3ZnPg0K',
      iconSize:[45, 57]
    });

    startMakerIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiNDRENDQ0M7c3Ryb2tlOiMzMzMzMzM7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KPC9zdHlsZT4NCjxwYXRoIGlkPSJYTUxJRF8yXyIgY2xhc3M9InN0MCIgZD0iTTIwLjQsMjAuNGMtMi45LDIuOS03LjksMi45LTEwLjgsMHMtMi45LTcuOSwwLTEwLjhzNy45LTIuOSwxMC44LDBTMjMuMywxNy41LDIwLjQsMjAuNHoiLz4NCjwvc3ZnPg0K',
      iconSize: [20,20]
    })

    layer.addTo(map);
    currentLayer.addTo(map);
    routeLayer.addTo(map);
    markerLayer.addTo(map);
  };

  var _setCurrentPoint = function(pos) {
    var newCurrentLocation = {
      name: 'Current Location',
      lat: pos.lat,
      lon: pos.lon
    }
    var center = L.latLng(newCurrentLocation.lat, newCurrentLocation.lon);

    currentLayer.addLayer(L.marker(center));

    map.setView(center, 14);
  };

  var _addMarker = function(mrkr) {
    markerLayer.clearLayers();
    var marker = L.marker([mrkr.lat,mrkr.lon], {icon: markerIcon});
    markerLayer.addLayer(marker);
    map.setView(marker.getLatLng(),14);
  };

  var _clearMap = function() {
    markerLayer.clearLayers();
    currentLayer.clearLayers();
    routeLayer.clearLayers();
  }

  var _addRouteLayer = function(routes, startPoint, destPoint) {
    markerLayer.clearLayers();
    var marker = L.marker([destPoint.lat, destPoint.lon], {icon: markerIcon});
    markerLayer.addLayer(marker);
    markerLayer.addLayer(L.marker([startPoint.lat, startPoint.lon], {icon: startMakerIcon}));
    
    routeLayer.clearLayers();
    var polylineRoute = L.polyline(routes, {color:'#32CAD6',opacity:1});
    routeLayer.addLayer(polylineRoute);
    map.fitBounds(polylineRoute.getBounds(),{
      paddingTopLeft: [0,430],
      paddingBottomRight : [0,30]
    });
  }

  return {
    init : _init,
    setCurrentPoint: _setCurrentPoint,
    addMarker: _addMarker,
    clearMap: _clearMap,
    addRouteLayer: _addRouteLayer
  };
})();


module.exports = MapObject;