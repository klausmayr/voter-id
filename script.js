var map;
var choroplethLayer;
var geojsonData;
var collegeLayer;

function getColor(d) {
  return d === null
    ? "gray"
    : d > 20000
    ? "#253494"
    : d > 10000
    ? "#2c7fb8"
    : d > 3000
    ? "#41b6c4"
    : d > 1
    ? "#a1dab4"
    : "#ffffcc";
}

function style(feature, attributeName) {
  return {
    fillColor: getColor(feature.properties[attributeName]),
    weight: 1,
    opacity: 0.1,
    color: "#000",
    dashArray: "3",
    fillOpacity: 0.9,
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 2,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.3,
  });

  var infoContent =
    "<b>" +
    layer.feature.properties.County +
    "</b><br>" +
    "Total Enrollment: " +
    layer.feature.properties.enrollment +
    "<br>" +
    // "% 18-34: " +
    // layer.feature.properties.perc_young +
    // "<br>" +
    "HBCU Enrollment: " +
    layer.feature.properties.hbcu +
    "<br>" +
    "Community College Enrollment: " +
    layer.feature.properties.cc +
    "<br>" +
    // "Alt. ID School Enrollment, 2020: " +
    // layer.feature.properties.id2020 +
    // "<br>" +
    "Enrollment at Schools Approved for 2025: " +
    layer.feature.properties.id2025 +
    "<br>" 

  ;

  $("#info-box").html(infoContent);
  $("#info-box").show();
}

function resetHighlight(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 1,
    opacity: 0.1,
    color: "#000",
    dashArray: "3",
    fillOpacity: 0.9,
  });
  $("#info-box").hide();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
  
  var layer = e.target;

  choroplethLayer.setStyle({
    fillOpacity: 0.9
  });
  layer.setStyle({
    weight: 2,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.3,
  });

  var infoContent =
    "<b>" +
    layer.feature.properties.County +
    "</b><br>" +
    "Total Enrollment: " +
    layer.feature.properties.enrollment +
    "<br>" +
    // "% 18-34: " +
    // layer.feature.properties.perc_young +
    // "<br>" +
    "HBCU Enrollment: " +
    layer.feature.properties.hbcu +
    "<br>" +
    "Community College Enrollment: " +
    layer.feature.properties.cc +
    "<br>" +
    // "Alt. ID School Enrollment, 2020: " +
    // layer.feature.properties.id2020 +
    // "<br>" +
    "Enrollment at Schools Approved for 2025: " +
    layer.feature.properties.id2025 +
    "<br>" 

  ;

  $("#info-box").html(infoContent);
  $("#info-box").show();
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

// CREATE THE COLLEGE LAYER

function growFeature(e) {
  var layer = e.target;
  layer.setStyle({
    radius: 11,
    opacity: 1,
    fillOpacity: 0.7,
    weight: 3,
  });

  var attributes = ["name", "enrollment", "id2020", "id2025", "hbcu", "cc"];

  var cuInfoContent =
    "<b>School Name: </b>" +
    e.target.feature.properties.name +
    "<br>" +
    "<b>Enrollment:</b> " +
    e.target.feature.properties.enrollment +
    "<br>" +
    "<b>Approved ID in 2020: </b>" +
    e.target.feature.properties.id2020 +
    "<br>" +
    "<b>Approved ID for 2025:</b> " +
    e.target.feature.properties.id2025 +
    "<br>" +
    "<b>HBCU:</b> " +
    e.target.feature.properties.hbcu +
    "<br>" +
    "<b>Community College:</b> " +
    e.target.feature.properties.cc +
    "<br><b>Phone Number: </b>" +
      layer.feature.properties.phone +
    "<br><b>Website: </b>" +
      layer.feature.properties.website;
  $("#cu-info-box").html(cuInfoContent);
  $("#cu-info-box").show();
}

function shrinkHighlight(e) {
  var layer = e.target;
  layer.setStyle({
    radius: 3.5,
    weight: 0.8,
    opacity: 1,
    fillOpacity: 1,
  });
  $("#cu-info-box").hide();
}

function clickCollege(e){
  var layer = e.target;
  collegeLayer.setStyle({
    radius: 3.5,
    weight: 0.8,
    opacity: 1,
    fillOpacity: 1,
  });
  
  layer.setStyle({
    radius: 11,
    opacity: 1,
    fillOpacity: 0.7,
    weight: 3,
  });

  var attributes = ["name", "enrollment", "id2020", "id2025", "hbcu", "cc"];

  var cuInfoContent =
    "<b>School Name: </b>" +
    e.target.feature.properties.name +
    "<br>" +
    "<b>Enrollment:</b> " +
    e.target.feature.properties.enrollment +
    "<br>" +
    "<b>Approved ID in 2020: </b>" +
    e.target.feature.properties.id2020 +
    "<br>" +
    "<b>Approved ID for 2025:</b> " +
    e.target.feature.properties.id2025 +
    "<br>" +
    "<b>HBCU:</b> " +
    e.target.feature.properties.hbcu +
    "<br>" +
    "<b>Community College:</b> " +
    e.target.feature.properties.cc +
    "<br><b>Phone Number: </b>" +
      layer.feature.properties.phone +
    "<br><b>Website: </b>" +
      layer.feature.properties.website;
  $("#cu-info-box").html(cuInfoContent);
  $("#cu-info-box").show();
}


function onEachPoint(feature, layer) {
  layer.on({
    mouseover: growFeature,
    mouseout: shrinkHighlight,
    click: clickCollege
  });
}

function createCollegeLayer(collegeData, selectedAttribute) {
  if (selectedAttribute === "enrollment") {
    // If "All" is selected, return all college features
    return L.geoJson(collegeData, {
      onEachFeature: onEachPoint,
      pointToLayer: function (feature, latlng) {
        var id2020 = feature.properties.id2020;
        var id2025 = feature.properties.id2025;
        var color;

        if (id2025 === "yes") {
          color = "#027148"; 
        } else if (id2025 === "no") {
          color = "#d64550"; 
        } else if (id2020 === "yes" && id2025 === "no") {
          color = "#F3F0F1"; 
        } else {
          color = "F3F0F1";
        }

        return L.circleMarker(latlng, {
          radius: 3,
          color: color,
          weight: 0.8,
          opacity: 1,
          fillOpacity: 1,
        });
      },
    });
  } else {
    const filteredCollegeData = collegeData.features.filter((feature) => {
      return feature.properties[selectedAttribute] === "yes";
    });

    return L.geoJson(filteredCollegeData, {
      onEachFeature: onEachPoint,
      pointToLayer: function (feature, latlng) {
        var id2020 = feature.properties.id2020;
        var id2025 = feature.properties.id2025;
        var color;

        if (id2025 === "yes") {
          color = "#027148";
        } else if (id2025 === "no") {
          color = "#d64550";
        } else if (id2020 === "yes" && id2025 === "no") {
          color = "#A2A6A5";
        }

        return L.circleMarker(latlng, {
          radius: 3,
          color: color,
          weight: 0.8,
          opacity: 1,
          fillOpacity: 1,
        });
      },
    });
  }
}

function toggleLegendVisibility(){
  var choroContent = document.querySelector(".legend-content");
  choroContent.style.display = choroContent.style.display === 'none' ? 'block' : 'none';
 var toggleBtn = document.getElementById("toggleLegendButton");

  var isExpanded = toggleBtn.classList.contains("fa-chevron-down");
  if (isExpanded) {
    toggleBtn.classList.remove("fa-chevron-down");
    toggleBtn.classList.add("fa-chevron-up");
  } else {
    toggleBtn.classList.remove("fa-chevron-up");
    toggleBtn.classList.add("fa-chevron-down");
  }
}

function toggleDataSelectorVisibility() {
  var dataSelectBar = document.querySelector(".data-select-bar");
  var isVisible = dataSelectBar.style.display !== 'none';

  dataSelectBar.style.display = isVisible ? 'none' : 'block';
  
   var toggleDataBtn = document.getElementById("toggleDataSelectorButton");

  var isExpanded = toggleDataBtn.classList.contains("fa-chevron-down");
  if (isExpanded) {
    toggleDataBtn.classList.remove("fa-chevron-down");
    toggleDataBtn.classList.add("fa-chevron-up");
  } else {
    toggleDataBtn.classList.remove("fa-chevron-up");
    toggleDataBtn.classList.add("fa-chevron-down");
  }
}



function createMap(geojsonData, collegeData, dataAttribute) {
  if (map) {
    map.remove();
  }

  map = L.map("map").setView([35.282169, -79.903457], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  var choroplethLayer = L.geoJson(geojsonData, {
    style: function (feature) {
      return style(feature, dataAttribute);
    },
    onEachFeature: onEachFeature,
  });

  collegeLayer = createCollegeLayer(collegeData, dataAttribute);

  var layers = L.layerGroup([choroplethLayer, collegeLayer]);

  layers.addTo(map);


}

function getLegendTitle(selectedAttribute) {
  const legendTitles = {
    id2025: "Schools with Approved IDs for 2025",
    idnot2025: "Schools without Approved IDs for 2025",
    id2020: "Schools with Approved IDs in 2020",
    hbcu: "HBCUs",
    cc: "Community Colleges",
    enrollment: "All Schools",
  };

  return legendTitles[selectedAttribute] || "";
}

$(document).ready(function () {
  $("#loading-container").show();
  var spinner = new Spinner().spin(document.getElementById("loading-spinner"));
  
  Promise.all([
    fetch("all_id_codes_merged.geojson").then((response) => response.json()),
    fetch("colleges_and_universities.geojson").then((response) =>
      response.json()
    ),
  ])
    .then(([geojsonData, collegeData]) => {
      $("#loading-container").hide();
      const dataSelect = $("#data");
      dataSelect.change(function () {
        const selectedAttribute = dataSelect.val();
        createMap(geojsonData, collegeData, selectedAttribute);

        $("#variable-legend-title").text(getLegendTitle(selectedAttribute));
      });

      const initialAttribute = dataSelect.val();
      createMap(geojsonData, collegeData, initialAttribute);
    
    })
    .catch((error) => {
      console.error("Error fetching GeoJSON data:", error);
      $("#loading-container").hide();
    })
    .finally(() => {
    spinner.stop();
});
  });


