// https://observablehq.com/@d3/zoomable-raster-vector?collection=@d3/d3-tile

var pi = Math.PI,
  tau = 2 * pi;

var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  },
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom,
  initialScale = 1 << 12,
  initialCenter = [-98 - 35 / 60, 39 + 50 / 60];

var svg = d3.select("#map")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

const projection = d3.geoMercator()
  .scale(1 / (2 * Math.PI))
  .translate([0, 0]);

const render = d3.geoPath(projection);

const tile = d3.tile()
  .extent([
    [0, 0],
    [width, height]
  ])
  .tileSize(512);


let image = svg.append("g")
  .attr("pointer-events", "none")
  .selectAll("image");

const path = svg.append("path")
  .attr("pointer-events", "none")
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("stroke-linecap", "round")
  .attr("stroke-linejoin", "round");

d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(
  function(topology) {
    feature = topojson.feature(topology, topology.objects.states)

    const zoom = d3.zoom()
      .scaleExtent([1 << 10, 1 << 15])
      .extent([
        [0, 0],
        [width, height]
      ])
      .on("zoom", ({
        transform
      }) => zoomed(transform));


    svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(-initialScale)
        .translate(...projection(initialCenter))
        .scale(-1));

    function zoomed(transform) {
      const tiles = tile(transform);

      image = image.data(tiles, d => d).join("image")
        .attr("xlink:href", d => url(...d))
        .attr("x", ([x]) => (x + tiles.translate[0]) * tiles.scale)
        .attr("y", ([, y]) => (y + tiles.translate[1]) * tiles.scale)
        .attr("width", tiles.scale)
        .attr("height", tiles.scale);

      projection
        .scale(transform.k / (2 * Math.PI))
        .translate([transform.x, transform.y]);

      path.attr("d", render(feature));
    }

  }
)

// https://wiki.openstreetmap.org/wiki/Tile_servers
function url(x, y, z, style = 'stamen') {
  if (style == 'stamen') {
    return `https://stamen-tiles.a.ssl.fastly.net/watercolor/${z}/${x}/${y}.jpg`
  } else if (style == 'openstreetmap') {
    return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
  } else if (style == 'opentopomap') {
    return `https://tile.opentopomap.org/${z}/${x}/${y}.png`
  } else {
    token = "pk.eyJ1IjoiY29uc3RhbnRpbm9zY2hpbGxlYmVlY2t4IiwiYSI6ImNrdXZiMWltZTFseXoyd3FqNG5kazU4ajkifQ.jyA-jI4Hj3dVO97LlzKysg"
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}?access_token=` + token
  }
}
