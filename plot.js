var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  },
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

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

d3.json('https://gist.githubusercontent.com/olemi/d4fb825df71c2939405e0017e360cd73/raw/d6f9f0e9e8bd33183454250bd8b808953869edd2/world-110m2.json')
  .then(function(world) {
    g.selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path)
      .style('fill', '#aaa')
      .style("stroke", "#333")
  })
