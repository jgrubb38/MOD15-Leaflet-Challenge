// Initialize the map and open center of the United States
var map = L.map('map').setView([37.0902, -95.7129], 5);

// Add Leaflet default base map layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Create the legend outside of the forEach loop
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  return div;
};

legend.addTo(map);

// Fetch earthquake data from the GeoJSON URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    // Loop through the earthquake features and create circles
    data.features.forEach(feature => {
      var coordinates = feature.geometry.coordinates;
      var magnitude = feature.properties.mag;
      var depth = coordinates[2];
      var location = feature.properties.place;

      // Define marker size based on earthquake magnitude
      var radius = magnitude * 10000;

      // Define the marker color based on earthquake depth
      var color;
      if (depth < 10) {
        color = '#a3f600';
      } else if (depth < 30) {
        color = '#dcf400';
      } else if (depth < 50) {
        color = '#f7db11';
      } else if (depth < 70) {
        color = '#fdb72a';
      } else if (depth < 90) {
        color = '#fca35d';
      } else {
        color = '#fe0019';
      }

      // Create a circle marker
      var circle = L.circle([coordinates[1], coordinates[0]], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: radius
      }).addTo(map);

      // Create a popup with earthquake information
      var popupContent = `Magnitude: ${magnitude}<br>Depth: ${depth} km<br>Location: ${location}`;
      circle.bindPopup(popupContent);
    });
  });
