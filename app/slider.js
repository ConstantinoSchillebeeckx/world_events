// https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
var dataTime = d3.range(0, 10).map(function(d) {
  return new Date(1995 + d, 10, 3);
});

var sliderTime = d3
  .sliderBottom()
  .min(d3.min(dataTime))
  .max(d3.max(dataTime))
  .step(1000 * 60 * 60 * 24 * 365)
  .width(300)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(dataTime)
  .default(new Date(1998, 10, 3))
  .on('onchange', val => {
    d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
    //triggerTransition();
  });

var gTime = d3
  .select('div#slider-time')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

gTime.call(sliderTime);

d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
