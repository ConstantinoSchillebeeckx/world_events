# world_events


## Setup

1. install node: `brew install node`
2. run a local http server (to get around [loading local JSON](https://stackoverflow.com/a/17223621/1153897)) `python -m http.server`
3. open page at [http://localhost:8000/](http://localhost:8000/)


## Getting overlapping shapes

Start with a larg `custom_shape` and interset it with the `map` to get just the part of the shape that overlaps with countries.

```javascript
// https://geojson.io/ -> if exportin geojson, need to use tool like https://github.com/tyrasd/rfc7946-to-d3 to "rewind"
var custom_shape = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-52.64648437499999, -9.188870084473393],
          [-41.220703125, 0.8788717828324276],
          [-28.30078125, -13.068776734357694],
          [-31.81640625, -26.35249785815401],
          [-59.58984374999999, -29.382175075145277],
          [-48.603515625, -17.811456088564473],
          [-64.599609375, -15.368949896534705],
          [-62.75390625, -7.536764322084078],
          [-52.64648437499999, -9.188870084473393]
        ]
      ]
    }
  }]
}

overlap = polygonClipping.intersection(
  map.geometries[0].coordinates,
  custom_shape.features[0].geometry.coordinates
)

overlap_geo = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: overlap[0]
  }
}

g.selectAll("path.custom")
  .data([turf.rewind(overlap_geo, {
    reverse: true,
    mutate: true
  })])
  .enter()
  .append("path")
  .attr("class", "custom")
  .attr("d", path)
  .style('fill', 'blue')
```
