// Google Maps Heat Map Application
// GIST 5300 - Homework 6

let map, heatmap, heatmap2;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  // Center on USA
  const myLatlng = { lat: 39.8283, lng: -98.5795 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
  });

  // Tesla Charging Stations Heat Map (Red/Yellow gradient - default)
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(teslaStations),
    map: map,
    radius: 20,
  });

  // Rest Areas Heat Map (Blue/Purple gradient)
  heatmap2 = new google.maps.visualization.HeatmapLayer({
    data: getPoints(restAreas),
    map: null, // Start hidden
    radius: 20,
    gradient: [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)"
    ]
  });

  // Set up event listeners for toggle buttons
  document.getElementById("toggle-heatmap").addEventListener("click", toggleHeatmap);
  document.getElementById("toggle-heatmap2").addEventListener("click", toggleHeatmap2);
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function toggleHeatmap2() {
  heatmap2.setMap(heatmap2.getMap() ? null : map);
}

function getPoints(dataArray) {
  var points = [];
  for(var i = 0; i < dataArray.length; i++) {
    points.push(new google.maps.LatLng(dataArray[i].lat, dataArray[i].lon));
  }
  return points;
}
