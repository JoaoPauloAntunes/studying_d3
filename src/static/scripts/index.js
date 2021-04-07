// d3.selectAll("p").style("color", function(d, i) {
//     return i % 2 ? "red" : "blue";
//   });
  
var map = L.map(document.getElementById('mapDIV'), {
  center: [-20.1438, -44.1301],
  zoom: 15
});

var basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {});
basemap.addTo(map);