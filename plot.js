// https://github.com/mfogel/polygon-clipping
// https://observablehq.com/@fil/hello-polygon-clipping
// https://bost.ocks.org/mike/map/
// https://www.d3indepth.com/geographic/
// https://github.com/simonepri/geo-maps
// https://geojson-maps.ash.ms/
// https://geojson.io/

const margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  },
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var poly = [
  [
    [0, 25 * 20],
    [8.5 * 20, 23.4 * 20],
    [13 * 20, 21 * 20],
    [19 * 20, 15.5 * 20]
  ]
];

// draw the map
// d3.json('https://gist.githubusercontent.com/olemi/d4fb825df71c2939405e0017e360cd73/raw/d6f9f0e9e8bd33183454250bd8b808953869edd2/world-110m2.json')
// d3.json('https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json')
// d3.json('map.geo.json')
d3.json('custom.geo.json')
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
    .style('fill', '#aaa')
    .style("stroke", "#333")

  var custom_shape = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-67.1484375,-5.615985819155327],[-71.015625,-20.2209657795223],[-54.66796875,-30.145127183376115],[-43.9453125,-33.35806161277886],[-27.59765625,-16.720385051693988],[-32.6953125,-5.0909441750333855],[-67.1484375,-5.615985819155327]]]}}]}
  console.log(custom_shape)

  g.selectAll("path")
    // .data(topojson.feature(map, map.objects.countries).features)
    // .data(map.features)
    // .data(map.geometries)
    .data(custom_shape.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style('fill', 'red')
    // .style("stroke", "#333")


  // bbox = path.bounds(map.features[0])

  g.selectAll("polygon")
    .data(poly)
    .enter()
    .append("polygon")
    .attr("points", function(d) {
      return d.map(function(d) {
        return [d[0], d[1]].join(",");
      }).join(" ");
    })
    .attr('stroke', 'black')
    .attr('fill', '#69a3b2');

  foo = polygonClipping.intersection(
    map.features[0].geometry.coordinates,
    custom_shape.features[0].geometry.coordinates
  )

  console.log(foo)
}
