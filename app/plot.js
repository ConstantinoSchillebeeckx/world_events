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
//d3.json('https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json')
// d3.json('map.geo.json')
// d3.json('custom.geo.json') // taken from https://geojson-maps.ash.ms/
d3.json('app/data/earth-coastlines-10km.geo.json') // https://github.com/simonepri/geo-maps
  .then(function(map) {
    render_map(map);
  })


function triggerTransition() {
  console.log('here')
}

/**
 * Render map
 * @param {object} map topojson map object
 */
function render_map(map) {
  console.log(map)

  /*
   * Render world map
   */
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
    //.data(map.features)
    .data(map.geometries)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "map")
    .style('fill', 'white')
    .style("stroke", "#333")
    .attr("vector-effect", "non-scaling-stroke")

  console.log(data_from_db)

  /*
   * Render polygons
   */

  overlap_geo = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: data_from_db.overlap[0]
    }
  }

  // select with class name so it actually enters; otherwise it won't since the path map above exists already
  g.selectAll("path.polys")
    .data([turf.rewind(overlap_geo, {
      reverse: true,
      mutate: true
    })])
    .enter()
    .append("path")
    .attr("class", "polys")
    .attr("d", path)
    .style('fill', 'blue')

  /*
   * Render points
   */

  pt = data_from_db.point_events[0].coordinates

  g.selectAll("circle.pts")
    .data([pt]).enter()
    .append("circle")
    .attr("class", "pts")
    .attr("cx", function(d) {
      return projection(d)[0];
    })
    .attr("cy", function(d) {
      return projection(d)[1];
    })
    .attr("r", "2px")
    .attr("fill", "red")

}
