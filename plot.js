// https://github.com/mfogel/polygon-clipping
// https://observablehq.com/@fil/hello-polygon-clipping
// https://bost.ocks.org/mike/map/
// https://www.d3indepth.com/geographic/
// https://github.com/simonepri/geo-maps
// https://geojson-maps.ash.ms/
// https://geojson.io/ -> if exportin geojson, need to use tool like https://github.com/tyrasd/rfc7946-to-d3 to "rewind"

const margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  },
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;


// draw the map
// d3.json('https://gist.githubusercontent.com/olemi/d4fb825df71c2939405e0017e360cd73/raw/d6f9f0e9e8bd33183454250bd8b808953869edd2/world-110m2.json')
// d3.json('https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json')
// d3.json('map.geo.json')
d3.json('custom.geo.json') // taken from https://geojson-maps.ash.ms/
  .then(function(map) {
    render(map);
  })

/**
 * Render map
 * @param {object} map topojson map object
 */
function render(map) {
  console.log(map)

  const projection = d3.geoMercator()
    .center([0, 30])
    .scale(200)
    .rotate([0, 0]);

  const path = d3.geoPath().projection(projection);

  const svg = d3.select("#viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  const g = svg.append("g")

  const zoom = d3.zoom()
    .on("zoom", (d) => {
      g.attr("transform", d.transform);
    });

  svg.call(zoom)

  // map paths
  g.selectAll("path")
    // .data(topojson.feature(map, map.objects.countries).features)
    // .data(map.features)
    // .data(map.geometries)
    .data(map.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "map")
    .style('fill', '#aaa')
    .style("stroke", "#333")

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
    map.features[0].geometry.coordinates,
    custom_shape.features[0].geometry.coordinates
  )

  overlap_geo = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: overlap[0]
    }
  }

  // select with class name so it actually enters; otherwise it won't since the map above exists already
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


  // bbox = path.bounds(map.features[0])


}
