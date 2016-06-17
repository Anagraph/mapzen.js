MapzenJS
====

### Leaflet Plugin
Mapzen JS is written as an extension of [Leaflet](http://leafletjs.com/), which means you have full access to Leaflet API through MapzenJS. You can check more details at [API](./#API) section.

Getting Started
----

The HTML below represents the minimum structure to display the map centered on NYC with [bubble-wrap](https://github.com/tangrams/bubble-wrap) style.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" href="https://mapzen.com/js/0.0.0/mapzen.css">
    <script src="https://mapzen.com/js/0.0.0/mapzen.min.js"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      // Add a map to the #map DIV, and center it on New York:
      var map = L.Mapzen.map('map', { scene: 'bubble-wrap' });
      map.setView([40.70531, -74.009], 13);
    </script>
  </body>
</html>
```

API
---

### Map

`L.Mapzen.map` extends [Leaflet `L.Map`](http://leafletjs.com/reference.html#map-class) with additional options. You can pass Mapzen House styles as `scene` inside of options, or you can have your own scene file path for Tangram. Whene there is no scene file declared, You would need to set your own tile to display the map.

```javascript
var map = L.Mapzen.map('map', {
  scene: 'refill'
})
```

Map Options

| Option  | Type   | Default | Description                      |
|---------|--------|---------|----------------------------------|
| `scene` | String | `null`  | Tangram scene identifier or URL. |

### Geocoder Control

`L.Mapzen.geocoder` adds a Mapzen Geocoder component to the map. [Create a Mapzen Search API key](https://mapzen.com/developers) to use the geocoder. Its default behaviour is customized to be easily used in demo. You can check more options for Mapzen Leaflet Geocoder on [its page](https://github.com/mapzen/leaflet-geocoder).

```javascript
var geocoder = L.Mapzen.geocoder(search_api_key);
geocoder.addTo(map);
```

### Bug (“Scarab”) Control

`L.Mapzen.bug` implements a small header for Mapzen demos, with the company logo and social media links.

```javascript
L.Mapzen.bug({
  name: 'Web Map',
  link: 'https://erasermap.com/maps',
  tweet: '@mapzen',
  repo: 'https://github.com/mapzen/web-map'
});
bug.addTo(map);
```

Bug Options

| Option  | Type   | Default                        | Description                            |
|---------|--------|--------------------------------|----------------------------------------|
| `name`  | String | `'Web Map'`                    | Name of this map.                      |
| `link`  | String | `'https://erasermap.com/maps'` | Permalink to this map.                 |
| `tweet` | String | `'{name}, powered by @mapzen'` | Default tweet text for Twitter button. |
| `repo`  | String | `'https://github.com/mapzen/'` | Github link for map source code.       |

### Locator Control

`L.Mapzen.locator` adds a geolocation control to the map.

``` javascript
var locator = L.Mapzen.locator();
locator.setPosition('bottomright');
locator.addTo(map);
```

### Hash Control

`L.Mapzen.hash` adds a URL hash to a map, so that the user can link to map location and state. The Hash function accepts components whose state can be linked.

```javascript
L.Mapzen.hash({
  map: map
})
```

Hash Options

| Option     | Type              | Default | Description           |
|------------|-------------------|---------|-----------------------|
| `map`      | L.Mapzen.map      | `null`  | Instance of map.      |
| `geocoder` | L.Mapzen.geocoder | `null`  | Instance of geocoder. |


Open Source 💕
----

MapzenJS is made from awesome open source projects.

- [Leaflet](http://leafletjs.com/)
- [Leaflet Locate Control](https://github.com/domoritz/leaflet-locatecontrol)
- [Mapzen Leaflet Geocoder](https://github.com/mapzen/leaflet-geocoder)
- [Mapzen Bug](https://github.com/mapzen/scarab/tree/master/src/components/bug)

[Build MapzenJS locally using `npm`](BUILD.md).