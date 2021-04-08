// d3.selectAll("p").style("color", function(d, i) {
//     return i % 2 ? "red" : "blue";
//   });
  
var map = L.map(document.getElementById('mapDIV'), {
  center: [-20.1438, -44.1301],
  zoom: 15
});

var basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {});
basemap.addTo(map);

var favorabilityMarker = L.marker(
  [-20.1438, -44.1301], 
  {title: 'Coletor 8'}
);
favorabilityMarker.bindPopup(`
  <div class="marker-popup">
    <p><strong>Descrição: </strong>Coletor 8</p>
    <p><strong>Favorabilidade: </strong>7.1390832579354</p>
    <p><strong>Latitude: </strong>-55.02501944</p>
    <p><strong>Longitude: </strong>-29.63505</p>
  </div>
`);
favorabilityMarker.addTo(map);	

  var theMarkers = L.geoJSON(markers);
theMarkers.addTo(map);

/* 
layerGroup = L.layerGroup(theMarkers);
var sliderControl = L.control.sliderControl({layer:layerGroup});
map.addControl(sliderControl);
sliderControl.startSlider(); */